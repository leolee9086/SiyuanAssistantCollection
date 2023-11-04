import kernelApi from '../../polyfills/kernelApi.js';
import { plugin } from '../../asyncModules.js'
import fs from '../../polyfills/fs.js'
import { logger } from '../../logger/index.js';
class Ghost {
    constructor(persona = {}) {
        this.persona = persona;
        this.avatarImage = persona.avatarImage
        this.shell = null;
        this.thinkCounter = 0;
        this.longTermMemory = {
            history: [],
            shortTermMemoryBackup: [],
            workingMemoryBackup: []
        }
        this.shortTermMemory = []; // 短期记忆
        this.workingMemory = []; // 工作记忆
        this.shortTermMemoryCapacity = plugin.configurer.get('聊天工具设置', '默认短期记忆长度').$value || 32; // 短期记忆容量
        this.workingMemoryCapacity = plugin.configurer.get('聊天工具设置', '默认工作记忆长度').$value || 7; // 工作记忆容量
        this.currentThoughts = []

    }
    async introspectChat(message, linkMap) {
        message.id = Lute.NewNodeID()
        await this.shell.embeddingMessage(message)
        //收到用户的消息时
        if (message.role === 'user') {
            let refs = { prompt: '', linkMap: {} }
            if (plugin.configurer.get("聊天工具设置", '自动给出参考').$value) {
                refs = await this.shell.searchRef(message)
                if(refs){
                    let referenceMessage = { role: 'system', content: refs.prompt, linkMap: refs.linkMap }
                    if (referenceMessage.content) {
                        this.workingMemory.push(referenceMessage)
                    }
    
                }
            }
            if (plugin.configurer.get("聊天工具设置", '插入回复样本提示').$value) {
                let conversationSample = this.persona.conversationSample
                let userStartConversations = conversationSample.filter((item, index) => {
                    return item.role === "user" && (index === 0 || conversationSample[index - 1].role === "assistant");
                });

                let randomConversation = userStartConversations[Math.floor(Math.random() * userStartConversations.length)];

                let startIndex = conversationSample.indexOf(randomConversation);
                let endIndex = conversationSample.findIndex((item, index) => index > startIndex && item.role === "user");

                let selectedConversation = conversationSample.slice(startIndex, endIndex === -1 ? undefined : endIndex);
                let selectedConversationText = selectedConversation.map(item => `${item.role}: ${item.content}`).join('\n');
                let systemPrompt = `System prompt: This is a historical conversation. Please maintain consistent behavior with the assistant in the conversation.\n${selectedConversationText}`;
                this.workingMemory.push({ role: 'system', content: systemPrompt })

            }
            message.linkMap =refs&& refs.linkMap
            this.workingMemory.push(message)
            this.longTermMemory.history.push(message)
            this.linkMap=this.longTermMemory.history.reduce((acc, item) => {
                if (item && item.linkMap) {
                    return { ...acc, ...item.linkMap };
                }
                return acc;
            }, {});

            return JSON.parse(JSON.stringify(this.workingMemory))
        }
        if (message.role === 'assistant') {
            message.linkMap = linkMap
            this.workingMemory.push(message)
            this.longTermMemory.history.push(message)
            this.organizeWorkingMemory(); // 整理工作记忆
            return JSON.parse(JSON.stringify(this.workingMemory))
        }
        logger.ghostlog(`message from ${message.role}:${message.content}`, (new Date()).toLocaleString())
    }
    //----//
    use(shell) {
        this.shell = shell;
    }
    async onWakeUp() {
        this.longTermMemory = (await plugin.loadData(`Akashic/${this.persona.name}.mem`)) || this.longTermMemory
        this.longTermMemory.shortTermMemoryBackup = this.longTermMemory.shortTermMemoryBackup || []
        this.longTermMemory.workingMemoryBackup = this.longTermMemory.workingMemoryBackup || []
        this.longTermMemory.history = this.longTermMemory.history || []
        let version = this.longTermMemory.pluginVersion
        try {
            this.shortTermMemory = JSON.parse(JSON.stringify(this.longTermMemory.shortTermMemoryBackup)) || []
        } catch (e) {
            logger.ghosterror
            this.shortTermMemory = []
        }
        try {
            this.workingMemory = JSON.parse(JSON.stringify(this.longTermMemory.workingMemoryBackup)) || []
        } catch (e) {
            logger.ghosterror
            this.workingMemory = []
        }
        // 初始化 undefined 的 content 为 ""
        let regex = /^\d{14}-[a-z]{7}$/;
        this.shortTermMemory.forEach(item => {
            if (item.content === undefined) {
                item.content = "";
            }
            if (!version) {
                if (item && item.linkMap) {
                    Object.keys(item.linkMap).forEach(key => {
                        if (!regex.test(key)) {
                            let id = Lute.NewNodeID()
                            item.linkMap[id] = item.linkMap[key];
                            delete item.linkMap[key];
                            item.content = item.content.replace(`(${key})`, `(${id})`)
                        }
                    });
                }
            }
            return item;

        });
        this.workingMemory.forEach(item => {
            if (item.content === undefined) {
                item.content = "";
            }
            if (!version) {
                if (item && item.linkMap) {
                    Object.keys(item.linkMap).forEach(key => {
                        if (!regex.test(key)) {
                            let id = Lute.NewNodeID()
                            item.linkMap[id] = item.linkMap[key];
                            delete item.linkMap[key];
                            item.content = item.content.replace(`(${key})`, `(${id})`)
                        }
                    });
                }
            }
        });
        this.longTermMemory.history.forEach(item => {
            if (item.content === undefined) {
                item.content = "";
            }
            if (!version) {
                if (item && item.linkMap) {
                    Object.keys(item.linkMap).forEach(key => {
                        if (!regex.test(key)) {
                            let id = Lute.NewNodeID()
                            item.linkMap[id] = item.linkMap[key];
                            delete item.linkMap[key];
                            item.content = item.content.replace(`(${key})`, `(${id})`)
                        }
                    });
                }
            }
        });
        this.linkMap=this.longTermMemory.history.reduce((acc, item) => {
            if (item && item.linkMap) {
                return { ...acc, ...item.linkMap };
            }
            return acc;
        }, {});

        if (this.shell) {
            this.shell.Ghost唤醒回调()
        }
    }
    async onShutdown() {
        if (this.shell) {
            this.shell.deactivate();
        }
        this.status.stopShell();
    }
    async organizeWorkingMemory() {
        // 调用shell的处理工作记忆方法
        try {
            if (plugin.configurer.get('聊天工具设置', '自动工作记忆总结').$value) {
                let result = await this.summryRecentMemory(this.workingMemory, this.workingMemoryCapacity, 'workingMemory');
                if (result) {
                    this.shortTermMemory.push(result); // 将结果添加到短期记忆中
                    this.longTermMemory.history.push(result);
                }
                if (plugin.configurer.get('聊天工具设置', '自动短期记忆总结').$value) {
                    let result1 = await this.summryRecentMemory(this.shortTermMemory, this.shortTermMemoryCapacity, 'shortTermMemory');
                    if (result1) {
                        this.shortTermMemory.push(result1);
                        this.shortTermMemory.shift();
                    }
                }
            }

        } catch (e) {
            console.error(e)
        }
        await this.storeLongTermMemory(); // 存储长期记忆
    }
    async summryRecentMemory(memory, capacity, memoryType) {
        if (memory.length >= capacity && JSON.stringify(memory).length > 2000) {
            //无论总结是否成功,都会触发遗忘,避免token消耗过大
            let _memory = JSON.parse(JSON.stringify(memory.slice(-7)));
            this[memoryType] = _memory
            let result = await this.shell.summryMemory(memory);
            this[memoryType] = [result].concat(this[memoryType]);
            return result;
        }
        return null;
    }
    async storeLongTermMemory() {
        this.longTermMemory.pluginVersion=plugin.meta&&plugin.meta.version
        this.longTermMemory.shortTermMemoryBackup = JSON.parse(JSON.stringify(this.shortTermMemory))
        this.longTermMemory.workingMemoryBackup = JSON.parse(JSON.stringify(this.workingMemory))
        if (this.longTermMemory.history[0]) {
            await this.shell.processHistory(this.longTermMemory.history)
            let oldData = await fs.readFile(`/data/storage/petal/${plugin.name}/Akashic/${this.persona.name}.mem`)
            if (plugin.configurer.get('聊天工具设置', '自动对话备份').$value) {
                await fs.writeFile(`/data/storage/petal/${plugin.name}/Akashic/${this.persona.name}${Date.now()}.back.mem`, oldData)
            }
            await plugin.saveData(`Akashic/${this.persona.name}.mem`, this.longTermMemory, null, 2)

            if (plugin.configurer.get('聊天工具设置', '对话备份自动清理').$value) {
                const path = `/data/storage/petal/${plugin.name}/Akashic/`;
                const files = await fs.readDir(path)
                const now = Date.now();
                const threeDaysAgo = now - (3 * 24 * 60 * 60 * 1000);

                files.forEach(
                    file => {
                        const timestamp = file.name.split('.')[0].split(this.persona.name)[1];
                        if (Number(timestamp) < threeDaysAgo && file.name.endsWith('.back.mem')) {
                            fs.removeFile(`${path}${file.name}`);
                        }
                    }
                )
            }
        }
    }
    async attemptAction(action, context, content) {
        try {
            if (context && typeof context[action] === 'function') {
                return await context[action](content);
            }
        } catch (error) {
            console.error(`Error in ${context.constructor.name}'s ${action} method:`, error);
        }
        return null;
    }
}



export default Ghost;