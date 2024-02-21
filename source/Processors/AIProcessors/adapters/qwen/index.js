import { qwenChatCompletions } from "./chat.js"
export const Adapter =class QwenAdapter{
    init(){
        this.nameSpace='aliyun'
        this.api_key='sk-07ee98214a8a46ae84b25b59635ad36a'
        return this
    } 
    async chatCompletions(prompts,api_key,modelName){
        if(modelName.startsWith('qwen')){
            return await qwenChatCompletions(prompts,api_key,modelName)
        }
    }
    models={
        'embedding':[

        ],
        'chat/completions':[
            {
                id:'qwen-turbo',
                process: async (inputMessages) => {
                    return await this.chatCompletions(inputMessages, this.api_key, 'qwen-turbo')
                },
                descriptions: "",
                nameSpace: this.nameSpace
            },
            {
                id:'qwen-plus',
                process: async (inputMessages) => {
                    return await this.chatCompletions(inputMessages, this.api_key, 'qwen-plus')
                },
                descriptions: "",
                nameSpace: this.nameSpace
            },
            {
                id:'qwen-max',
                process: async (inputMessages) => {
                    return await this.chatCompletions(inputMessages, this.api_key, 'qwen-max')
                },
                descriptions: "",
                nameSpace: this.nameSpace
            },
            {
                id:'qwen-max-1201',
                process: async (inputMessages) => {
                    return await this.chatCompletions(inputMessages, this.api_key, 'qwen-max-1201')
                },
                descriptions: "",
                nameSpace: this.nameSpace
            },
            {
                id:'qwen-max-longcontext',
                process: async (inputMessages) => {
                    return await this.chatCompletions(inputMessages, this.api_key, 'qwen-max-longcontext')
                },
                descriptions: "",
                nameSpace: this.nameSpace
            }   
        ]
    }
}