
export  class openAiChat {
    constructor(options = {}) {
        this.options = {
                apiKey: "",
                apiTimeout: 60,
                apiProxy: "",
                apiModel: "",
                apiMaxTokens: 0,
                apiBaseURL: "",
                ...globalThis.siyuan.config.ai.openAI // 使用 siyuan.config.ai.openAI 对象进行初始化
        };
        this.options=  {...this.options,...options}
        this.messages = []; // 初始化 messages 数组
    }

    addAsSystem(系统提示词) {
        this.messages.push({
            role: 'system',
            content: 系统提示词
        });
        return this.messages;
    }

    async postAsUser(message) {
        this.messages.push({
            role: 'user',
            content: message
        });
        let data = await this.sendMessageToOpenAI(this.messages);
        this.messages = [];
        return data;
    }
    async postBatch(messages) {
        this.messages = this.messages.concat(messages);
        let data = await this.sendMessageToOpenAI(this.messages);
        this.messages = [];
        return data;
    }
    set(options) {
        this.options = { ...this.options, ...options };
    }
    async sendMessageToOpenAI(userMessage) {
        const post = userMessage.map(item=>{
            let obj ={
                content:item.content,
                role:item.role
            }
            return obj
        })
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${this.options.apiKey}`);
        myHeaders.append("User-Agent", "SiYuan/2.10.2 https://b3log.org/siyuan Electron Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) SiYuan/2.10.2 Chrome/114.0.5735.289 Electron/25.7.0 Safari/537.36");
        myHeaders.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify({
                model: this.options.apiModel,
                messages: post,
                //   safe_mode: false
            }),
            redirect: 'follow'
        };
        const response = await fetch(`${this.options.apiBaseURL}/chat/completions`, requestOptions);
        //const response = await fetch(`http://127.0.0.1:8000/chat/completions`, requestOptions);
        const data = await response.json();
        return data;
    }
}
export default openAiChat