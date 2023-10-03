export class ChatSession {
    constructor() {
        this.messages = []; // 初始化 messages 数组
    }
    addAsSystem(systemMessage) {
        this.messages.push({
            role: 'system',
            content: systemMessage
        });
        return this.messages;
    }
    async postAsUser(userMessage) {
        this.messages.push({
            role: 'user',
            content: userMessage
        });
        let data = await this.send(this.messages);
        this.messages=[]
        return data;
    }
    async postBatch(messages) {
        this.messages = this.messages.concat(messages);
        let data = await this.send(this.messages);
        this.messages=[]
        return data;
    }
}