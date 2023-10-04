import { getLanguageProcessor } from "../processors/language_processors/index.js";
import { EventEmitter } from "../../eventsManager/EventEmitter.js";
import { AIChatInterface } from "./drivers/AIChatInterface.js";
import { processorFeatureDict } from "./baseLine.js";
import { embeddingText } from "../../utils/textProcessor.js";
import { plugin } from "../../asyncModules.js";
import { findSimilarity } from "../../vectorStorage/vector.js";
import logger from "../../logger/index.js";
import BlockHandler from "../../utils/BlockHandler.js";
let roles = {
    USER: 'user',
    SYSTEM: 'system',
    ASSISTANT: 'assistant'
}
export default class Shell extends EventEmitter {
    constructor(type = 'default', drivers = {}, processors = {}) {
        super();
        // 驱动应该是一个对象，键是驱动类型，值是驱动的原型
        logger.aiShelllog(this)
        this.created= Date.now()
        this.drivers = {
            textChat: AIChatInterface,
            search: [],
            ...drivers
        };
        //components中的各个类型列举了AI可以使用的功能,之后如果token价格降下来这里会重新部分交给AI自己判断
        this.components = {
            search: [],
            textChat: []
        }
        // 处理器应该是一个对象，键是处理器类型，值是处理器的实例,之后如果token价格降下来这里会重新部分交给AI自己判断
        this.processors = {
            ...processors
        };
        this.type = type
        this.thinkingTip = '等待中...'
        this.已经初始化=false
    }
    async 初始化事件监听器() {
        if(this.已经初始化){
            return
        }
        this.chanel = 'Ai_shell_' + this.ghost.persona.name
        this.on('textChat_userMessage', (event) => {
            logger.aiShelllog(event.detail)
            this.replyChat(event.detail)
        })
        plugin.eventBus.on('baseProcessorChange',(event)=>{
            let processor = getLanguageProcessor()
            this.changeProcessor('languageProcessor',new processor(this.ghost.persona))
        })
        this.已经初始化 = true
    }
    async Ghost唤醒回调() {
        this.showHistory()
        this.avatarImage = this.ghost.avatarImage
        this.thinkingTip = this.ghost.thinkingTip || '等待中...'
        this.name = this.ghost.persona.name
        this.初始化事件监听器()
    }
    async replyChat(text) {
        logger.aiShelllog(text)
        let 消息对象 = { role: roles.USER, content: text }
        let result = await this.ghost.introspectChat(消息对象)
        this.showText(消息对象)
        result = await this.completeChat(result)
        //introspect系列的方法都是让ghost有机会对消息进行后处理的
        result = await this.ghost.introspectChat({ role: roles.ASSISTANT, content: result })
        this.showText(result[result.length - 1])
        return result[result.length - 1]
    }
    async completeChat(chat) {
        let _chat
        if (chat[chat.length - 1] && chat[chat.length - 1].role == 'user') {
            const model = plugin.configurer.get('向量工具设置', '默认文本向量化模型').$value
            let recalledMessage = await this.recallWithVector(chat[chat.length - 1].vectors[model], chat[chat.length - 1])
            recalledMessage = recalledMessage.map(item => {
                let { meta } = item
                let obj = { role: meta.role, content: meta.memo || meta.content }
                return obj
            })
            _chat = [{ role: 'system', content: `there're past conversation about similar topic:${JSON.stringify(recalledMessage)}` }].concat(chat)
        }
        _chat = _chat || chat
        _chat = _chat.map(
            item => {
                if (!item.content) {
                    item.content = ""
                }
                return item
            }
        )
        return this.processors.languageProcessor.completeChat(_chat);
    }
    recallWithVector(vector, message) {
        const model = plugin.configurer.get('向量工具设置', '默认文本向量化模型').$value
        let history = this.ghost.longTermMemory.history.filter(
            item => {
                let flag = true
                if (!item) {
                    return
                }
                if (!item.content) {
                    return
                }
                if (item.content.trim() === message.content.trim()) {
                    flag = false
                }
                if (this.ghost.workingMemory.find(item => { return (item.id == message.id) || item.content.trim() == message.content.trim() })) {
                    flag = false
                }
                if (this.ghost.shortTermMemory.find(item => { return item.content.trim() == message.content.trim() })) {
                    flag = false
                }
                return flag
            }
        )
        let vectors = history.map(item => { return { meta: item, vector: item.vectors[model] } })
        let finded = findSimilarity(vector, vectors, 2)
        return finded
    }
    async restrict(ghost) {
        this.ghost = ghost;
        await this.ghost.onWakeUp()
        let LanguageProcessor = await getLanguageProcessor()
        this.changeProcessor('languageProcessor', new LanguageProcessor(this.ghost.persona))
    }
    /**processors */
    changeProcessor(processorName, processorProvided) {
        if (this.checkProcessor(processorProvided, processorName)) {
            this.processors[processorName] = processorProvided;
        } else {
            logger.warn(`Processor ${processorName} does not have all required features.`);
        }
    }
    checkProcessor(processor, processorName) {
        const features = processorFeatureDict[processorName]['base']; // replace with actual feature names
        return features.every(feature => {
            if (typeof processor[feature] !== 'function') {
                logger.warn(`${processor.name} is missing required function ${feature} for ${processorName}.`);
                return false;
            }
            return true;
        });
    }
    /**drivers */
    addDriver(driverType, driverClass) {
        if (!this.drivers[driverType]) {
            this.drivers[driverType] = driverClass;
        } else {
            logger.warn('driver涉及用户体验,不能替换')
        }
    }
    /** */
    showHistory() {
        let history = this.ghost.longTermMemory.history
        history.forEach(historyItem => {
            //因为古早版本没有ID,这里需要加上
            if (!historyItem.id) {
                historyItem.id = Lute.NewNodeID()
            }
            if (historyItem.role !== 'system') {
                this.showText(historyItem)
            }
        })
    }
    showText(input) {
        try {
            this.components['textChat'].forEach(
                chatInterface=>{
                    if(chatInterface){
                        chatInterface.component.emit(
                            'textWithRole',
                            input
                        )
                    }
                }
            )
        //    this.emit(`textChat_${this.name}_textWithRole`, input);
        } catch (e) {
            logger.warn('当前没有已初始化的聊天模块,无法显示聊天', e);
        }
    }


    async OnAskedForHistory() {
        return this.ghost.longTermMemory.history
    }
    async createInterface(options, driver) {
        let { type, describe, container } = options
        let component
        if (!driver) {
            if (!this.drivers[type] || this.drivers[type].length === 0) {
                logger.warn(`${this.ghost.name}使用的shell类型${this.type}没有类型为${type}的驱动`)
                return
            }
            this.components[type] = this.components[type] || []
            component = new this.drivers[type](container, this);
            this.components[type].push({ describe, component })
        }
        else {
            this.components[type] = this.components[type] || []
            component = new driver(options)
            this.components[type].push(component)
        }
        component.shell = this
        this.初始化界面(type, component)
        return component
    }
    removeInterface(interfaceToRemove,type) {
        // 遍历所有类型的接口
        for (let type in this.components) {
            // 找到要删除的接口的索引
            const index = this.components[type].findIndex(component => 
                { 
                    logger.error(component,interfaceToRemove)
                    return component.component === interfaceToRemove
                });
            // 如果找到了接口
            if (index !== -1) {
                // 如果接口有 'dispose' 方法，调用它进行清理
                if (typeof interfaceToRemove.dispose === 'function') {
                    interfaceToRemove.dispose();
                }
                // 从组件列表中删除接口
                this.components[type].splice(index, 1);
                // 已经找到并删除了接口，可以提前结束循环
                break;
            }
        }
    }
     初始化界面(type, component) {
        switch (type) {
            case 'textChat':
                this.ghost.longTermMemory.history.forEach(
                    input => {
                        component.emit(`textWithRole`, input)
                    }
                )
        }
    }
    async searchRef(text) {
        let prompt = `
        ---REFERENCES---
        `
        try {
            let refs
            let refsElement = document.querySelectorAll('.tips-card.selected')
            refsElement.forEach(
                el => {
                    if (el.getAttribute('markdown-content')) {
                        refs += `\n${el.getAttribute('markdown-content')}`
                    }
                }
            )
            let selectedBlocks =document.querySelectorAll('.protyle-wysiwyg--select')
            selectedBlocks.forEach(
                el=>{
                    refs+=`\n[${(new BlockHandler(el.getAttribute('data-node-id'))).content}](siyuan://blocks/${el.getAttribute('data-node-id')})`
                }
            )
            let selectedText =plugin.statusMonitor.get('editorStatus','selectedText').$value
            refs += selectedText
            if (refs) {
                return prompt + '\n' + refs

            } else {
                return ""
            }
        } catch (e) {
            logger.error(e)
            return ""
        }
    }
    //这里是整理记忆的方法
    async summryMemory(workingMemory) {
        let copied = workingMemory.map(item => { return { role: item.role, content: item.content || "" } })
        copied = copied.filter(item => { return item.role !== 'system' })
        logger.aiShelllog(copied)
        const result = await this.processors.languageProcessor.summarizeChat(copied)

        return { role: "system", content: `the coversation history summary is: ${result}` }
    }
    async processHistory(history) {
        for (let item of history) {
            await this.embeddingMessage(item)
            if (!item.content) {
                logger.warn(item)
                item.content = ''
            }
            if (item.content.length > 1024 && !item.memo) {
                item.memo = (await this.summarizeText(item.content)) || undefined
            }
        }
    }
    async summarizeText(content) {
        return await this.processors.languageProcessor.summarizeText(content)
    }
    async embeddingMessage(message) {
        const model = plugin.configurer.get('向量工具设置', '默认文本向量化模型').$value
        message.vectors = message.vectors = message.vectors || {}
        if (!message.vectors[model] && message.content) {
            message.vectors[model] = await embeddingText(message.content)
        }
        if (!message.id) {
            message.id = Lute.NewNodeID()
        }
    }
}

//这下面的代码暂时没有用上,先不要清理
export class ChatStore extends EventEmitter {
    constructor(vectorDatabase) {
        super();
        this.messages = {};
        this.vectorDatabase = vectorDatabase;  // 向量数据库实例
    }
    createMessage(id, message, type) {
        const messageController = this.getMessageController(type, message);
        this.messages[id] = messageController;
        this.vectorDatabase.insert(id, messageController.vector, messageController.content);  // 插入向量和内容
        this.emit('messageCreated', { id, messageController });
    }
    updateMessage(id, newMessage) {
        const messageController = this.messages[id];
        if (messageController) {
            messageController.update(newMessage);
            this.vectorDatabase.update(id, messageController.vector, messageController.content);  // 更新向量和内容
            this.emit('messageUpdated', { id, messageController });
        }
    }
    deleteMessage(id) {
        const messageController = this.messages[id];
        if (messageController) {
            messageController.remove();
            this.vectorDatabase.remove(id);  // 删除向量
            delete this.messages[id];
            this.emit('messageDeleted', { id });
        }
    }
    getMessageController(type, message) {
        // ...和之前一样...
    }
}



