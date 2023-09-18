import kernelApi from '../../polyfills/kernelApi.js';
import { plugin } from '../../asyncModules.js'
import fs from '../../polyfills/fs.js'
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
        this.shortTermMemoryCapacity = 32; // 短期记忆容量
        this.workingMemoryCapacity = 7; // 工作记忆容量
        this.currentThoughts = []

    }
    async introspectChat(message) {
        message.id = Lute.NewNodeID()
        await this.shell.embeddingMessage(message)
        //收到用户的消息时
        if (message.role === 'user') {
            let referenceMessage = { role: 'system', content: await this.shell.searchRef(message.content) }
            if (referenceMessage.content) {
                this.workingMemory.push(referenceMessage)
            }
            this.workingMemory.push(message)
            this.longTermMemory.history.push(message)
            return JSON.parse(JSON.stringify(this.workingMemory))
        }
        if (message.role === 'assistant') {
            this.workingMemory.push(message)
            this.longTermMemory.history.push(message)
            this.organizeWorkingMemory(); // 整理工作记忆
            return JSON.parse(JSON.stringify(this.workingMemory))
        }
        console.log(`message from ${message.role}:${message.content}`, (new Date()).toLocaleString())
    }
    //----//
    use(shell) {
        this.shell = shell;
    }
    async onWakeUp() {
        this.longTermMemory = (await plugin.loadData(`Akashic/${this.persona.name}.mem`)) || this.longTermMemory
        this.shortTermMemory = JSON.parse(JSON.stringify(this.longTermMemory.shortTermMemoryBackup)) || []
        this.workingMemory = JSON.parse(JSON.stringify(this.longTermMemory.workingMemoryBackup)) || []
        // 初始化 undefined 的 content 为 ""
        this.shortTermMemory.forEach(item => {
            if (item.content === undefined) {
                item.content = "";
            }
        });
        this.workingMemory.forEach(item => {
            if (item.content === undefined) {
                item.content = "";
            }
        });
        this.longTermMemory.history.forEach(item => {
            if (item.content === undefined) {
                item.content = "";
            }
        });
        if (this.shell) {
            this.shell.onGhostWaked()
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
        let result = await this.summryRecentMemory(this.workingMemory, this.workingMemoryCapacity);
        if (result) {
            this.shortTermMemory.push(result); // 将结果添加到短期记忆中
            this.longTermMemory.history.push(result);
            let result1 = await this.summryRecentMemory(this.shortTermMemory, this.shortTermMemoryCapacity);
            if (result1) {
                this.shortTermMemory.push(result1);
                this.shortTermMemory.shift();
            }
        }
        await this.storeLongTermMemory(); // 存储长期记忆
    }
    async summryRecentMemory(memory, capacity) {
        if (memory.length >= capacity || JSON.stringify(memory).length > 1000) {
            let result = await this.shell.summryMemory(memory);
            memory = memory.slice(-4);
            memory = [result].concat(memory);
            return result;
        }
        return null;
    }
    async storeLongTermMemory() {
        this.longTermMemory.shortTermMemoryBackup = JSON.parse(JSON.stringify(this.shortTermMemory))
        this.longTermMemory.workingMemoryBackup = JSON.parse(JSON.stringify(this.workingMemory))
        if (this.longTermMemory.history[0]) {
            await this.shell.processHistory(this.longTermMemory.history)
            let oldData = await fs.readFile(`/data/storage/petal/${plugin.name}/Akashic/${this.persona.name}.mem`)
            await fs.writeFile(`/data/storage/petal/${plugin.name}/Akashic/${this.persona.name}${Date.now()}.back.mem`, oldData)
            await plugin.saveData(`Akashic/${this.persona.name}.mem`, this.longTermMemory, null, 2)
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