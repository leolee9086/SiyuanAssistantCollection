import { getLanguageProcessor } from "../processors/language_processors/index.js";
import { EventEmitter } from "../../eventsManager/EventEmitter.js";
import { AIChatInterface } from "./drivers/AIChatInterface.js";
import { processorFeatureDict } from "./baseLine.js";
import { embeddingText } from "../../utils/textProcessor.js";
import { plugin } from "../../asyncModules.js";
import { findSimilarity } from "../../vectorStorage/vector.js";
import logger from "../../logger/index.js";
import BlockHandler from "../../utils/BlockHandler.js";
import { getPersonaSetting, initPersonaSetting } from "../setting/index.js";
import { combinedSimilarityWithPenalty } from "../../searchers/sorters/index.js";
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
        this.created = Date.now()
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
        this.已经初始化 = false
    }
    async 初始化事件监听器() {
        if (this.已经初始化) {
            return
        }
        this.chanel = 'Ai_shell_' + this.ghost.persona.name
        this.on('textChat_userMessage', (event) => {
            logger.aiShelllog(event.detail)
            this.replyChat(event.detail)
        })
        plugin.eventBus.on('baseProcessorChange', (event) => {
            let processor = getLanguageProcessor(this.name)
            this.changeProcessor('languageProcessor', new processor(this.ghost.persona))
        })
        this.已经初始化 = true
    }
    async Ghost唤醒回调() {
        this.showHistory()
        this.avatarImage = this.ghost.avatarImage
        this.thinkingTip = this.ghost.thinkingTip || '等待中...'
        this.name = this.ghost.persona.name
        initPersonaSetting(this.ghost.persona.name)
        this.初始化事件监听器()
    }

    async replyChat(text) {
        logger.aiShelllog(text)
        let 消息对象 = { role: roles.USER, content: text }
        let result = await this.ghost.introspectChat(消息对象)
        let linkMap = result[result.length - 1].linkMap
        this.showText(消息对象)
        let length = getPersonaSetting(this.name,'聊天工具设置', '默认工作记忆长度').$value
        result = result.slice(-length); // 截取最近的 'length' 条工作记忆
        result = await this.completeChat(result);
        //introspect系列的方法都是让ghost有机会对消息进行后处理的
        result = await this.ghost.introspectChat({ role: roles.ASSISTANT, content: result }, linkMap)

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
                //此处content有时候会是undefined
                let messageContent = message.content.trim();
                if (this.ghost.workingMemory.find(item => {
                    return item && item.content && ((item.id == message.id) || item.content.trim() == messageContent)
                })) {
                    flag = false
                }
                if (this.ghost.shortTermMemory.find(item => {
                    return item && item.content && item.content.trim() == messageContent
                })) {
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
                chatInterface => {
                    if (chatInterface) {
                        chatInterface.component.emit(
                            'textWithRole',
                            input
                        )
                    }
                }
            )
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
    removeInterface(interfaceToRemove, type) {
        // 遍历所有类型的接口
        for (let type in this.components) {
            // 找到要删除的接口的索引
            const index = this.components[type].findIndex(component => {
                logger.error(component, interfaceToRemove)
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
    async searchRef(message) {
        let _prompt = `
You can use these references to answer the user's questions, note that you must list all the references you used in your answer.
Do not fabricate non-existent references, do not use references that you think are irrelevant to the question, even if they are listed below.
If you need detailed content from a reference, please explain to the user.
\n
                `
        let prompt
        //选中的块最先加上
        if (getPersonaSetting(this.name,"聊天工具设置", '自动发送上一次选择的块').$value) {
            try {
                let refs
                let selectedBlocks = document.querySelectorAll('.protyle-wysiwyg--select')
                for (let el of selectedBlocks) {
                    let text = `\n[${(new BlockHandler(el.getAttribute('data-node-id'))).content}](siyuan://blocks/${el.getAttribute('data-node-id')})`
                    refs += `\n${text}`

                }
                if (refs) {
                    prompt + '\n' + refs
                }
            } catch (e) {
                logger.aiShellerror(e)
            }
        }
        logger.aiShelllog(message, prompt)

        //从启用的搜索器获取参考
        if (getPersonaSetting(this.name,"聊天工具设置", '自动发送当前搜索结果').$value) {
            const searchers = this.drivers.search
            try {
                for (let searcher of searchers) {
                    const results = await searcher.search(message)
                    for (let result of results) {
                        prompt += result
                    }
                }
            } catch (e) {
                logger.aiShellerror(e)
            }
        }
        logger.aiShelllog(message, prompt)
        //这里的部分是从tips里面获取参考
        if (getPersonaSetting(this.name,"聊天工具设置", '自动发送当前所有tips').$value) {
            try {
                let refs = '';
                let refsElements = document.querySelectorAll('.tips-card')
                for (let el of refsElements) {
                    if (el.getAttribute('markdown-content')) {
                        let lines = el.getAttribute('markdown-content').split('\n');
                        for (let line of lines) {
                            refs += `\n${line}`;
                        }
                    }
                }
                if (refs) {
                    prompt += '\n' + refs;
                }

            } catch (e) {
                logger.aiShellerror(e);
            }
        } else {
            try {
                let refs = '';
                let refsElements = document.querySelectorAll('.tips-card.selected')
                for (let el of refsElements) {
                    if (el.getAttribute('markdown-content')) {
                        let lines = el.getAttribute('markdown-content').split('\n');
                        for (let line of lines) {
                            refs += `\n${line}`;

                        }
                    }
                }
                if (refs) {
                    prompt += '\n' + refs;
                }
            } catch (e) {
                logger.aiShellerror(e);
            }

        }
        logger.aiShelllog(message, prompt)
        //选中的文字
        try {
            let refs = '';
            let selectedText = plugin.statusMonitor.get('editorStatus', 'selectedText').$value;
            refs += selectedText;
            if (refs) {
                refs += `\n${refs}`

                prompt += '\n' + refs;
            }
        } catch (e) {
            logger.aiShellerror(e);
        }
        logger.aiShelllog(message, prompt)
        //选中的块
        prompt = prompt.split('\n') // 将prompt分割成行
            .filter(line => line.trim() !== '' && line.trim() !== 'undefined') // 过滤掉空行和内容为"undefined"的行
            .join('\n'); // 将过滤后的行重新组合成字符串
        logger.aiShelllog(message, prompt)
        prompt = plugin._lute.Md2HTML(prompt)
        let parser = new DOMParser();
        let doc = parser.parseFromString(prompt, 'text/html');
        let links = Array.from(doc.querySelectorAll('a'))
        let sorted = []
        links.sort((a, b) => {
            
            const distanceA = combinedSimilarityWithPenalty(a.textContent, message.content,sorted);
            sorted.push(a.textContent)
            const distanceB = combinedSimilarityWithPenalty(b.textContent, message.content,sorted);
            sorted.push(a.textContent)
            return distanceA - distanceB;
        });
        // 计算词频
        sorted = undefined
        let linkMap = {};
        for (let i = 0; i < links.length; i++) {
            let link = links[i];
            let id = Lute.NewNodeID();
            linkMap[id] = link.href;
            link.href = 'ref:' + id.split('-').pop();
        }
        prompt = plugin._lute.HTML2Md(doc.body.innerHTML);
        logger.aiShelllog(message, prompt)
        let maxLength = getPersonaSetting(this.name,"聊天工具设置", '总参考最大长度').$value;
        let lines = prompt.split('\n');
        let result = '';
        let currentLength = 0;
        for (let line of lines) {
            if (currentLength + line.length <= maxLength) {
                result += line + '\n';
                currentLength += line.length;
            } else {
                break;
            }
        }
        prompt = result.trim(); // 去除最后一个换行符
        logger.aiShelllog(message, prompt)
        if (prompt) {
            prompt = _prompt + prompt
            return { prompt, linkMap }
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



