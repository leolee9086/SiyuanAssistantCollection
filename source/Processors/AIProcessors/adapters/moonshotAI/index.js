//https://platform.moonshot.cn/api-reference
export class Adapter {
    init(){
        this.nameSpace= 'moonshot'
        this.api_key ='sk-XaJobV7IN9NPgY1zmadLtjoojoxiPgPSV3uGIQ0DMWDxVsKm'
        return this
    }
    async chatCompletions(prompts, api_key, modelName) {
        const baseURL = "https://api.moonshot.cn/v1/chat/completions";
        const headers = {
            'Authorization': `Bearer ${api_key}`,
            'Content-Type': 'application/json' // 添加了 Content-Type 头部
        };
        try {
            const response = await fetch(baseURL, {
                method: 'POST', // 修复了这里
                headers,
                body: JSON.stringify({ // 将对象转换为 JSON 字符串
                    messages: prompts,
                    model: modelName
                })
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json(); // 处理响应体，转换为 JSON
        } catch (error) {
            console.error("Error fetching chat completions:", error);
            throw error; // 抛出错误，以便调用者可以处理
        }
    }
    models={
        'chat/completions':[
            {
                id:'moonshot-v1-8k',
                process:async(inputMessages)=>{
                    return await this.chatCompletions(inputMessages,this.api_key,'moonshot-v1-8k')
                },
                nameSpace:this.nameSpace
            },
            {
                id:'moonshot-v1-32k',
                process:async(inputMessages)=>{
                    return await this.chatCompletions(inputMessages,this.api_key,'moonshot-v1-8k')
                },
                nameSpace:this.nameSpace
            },
            {
                id:'moonshot-v1-128k',
                process:async(inputMessages)=>{
                    return await this.chatCompletions(inputMessages,this.api_key,'moonshot-v1-8k')
                },
                nameSpace:this.nameSpace
            }
        ]
    }
}