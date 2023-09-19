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
        return this.messages;
    }

    async postBatch(messages) {
        this.messages = this.messages.concat(messages);
        return this.messages;
    }
    async postChat(){

    }
}