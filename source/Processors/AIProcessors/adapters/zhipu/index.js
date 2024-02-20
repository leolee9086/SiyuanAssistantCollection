import { chatCompletions } from "./chat.js"

export const Adapter = class zhipuAdapter {
    init() {
        this.nameSpace = 'zhipu'
        this.api_key = '729c9a1a27f517607c3c589cfcb12c1c.G4dVYc6SjaSiDbHE'
        return this
    }
    async chatCompletions(prompts, api_key, modelName) {
        return await chatCompletions(prompts, api_key, modelName)
    }
    models = {
        'completions': [
            {
                id: "characterglm",
                process: async (inputMessages) => {
                    return await this.chatCompletions(inputMessages, this.api_key, 'characterglm')
                },
                descriptions: "",
                nameSpace: this.nameSpace
            },
        ],
        'chat/completions': [
            {
                id: 'chatglm-turbo',
                process: async (inputMessages) => {
                    return await this.chatCompletions(inputMessages, this.api_key, 'chatglm_turbo')
                },
                descriptions: "",
                nameSpace: this.nameSpace

            },
            {
                id: 'chatglm-pro',
                process: async (inputMessages) => {
                    return await this.chatCompletions(inputMessages, this.api_key, 'chatglm_pro')
                },
                descriptions: "",
                nameSpace: this.nameSpace
            }
        ]
    }
}