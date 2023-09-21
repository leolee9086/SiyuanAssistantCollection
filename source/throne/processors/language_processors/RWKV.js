import { openAiChat } from './LLMAPIS/openAIChat.js'
import { MAGI } from './MAGI.js'
import { configer } from '../util/config.js'
let options = await configer.getConfig('rwkv')

export class LanguageProcessor {
    constructor(persona) {
        this.magi = new MAGI(openAiChat, {
            apiBaseURL: "http://127.0.0.1:8000/v1",
            model: '',
            ...options,
            ...globalThis.siyuan.config.ai.openAI // 使用 siyuan.config.ai.openAI 对象进行初始化
        }, persona)
    }
    async completeChat(chat) {
        try {
            let reply = await this.magi.echo.reply(chat)
            return reply[0].action
        } catch (error) {
            console.error(`Error in completeChat: ${error}`);
            return undefined;
        }
    }
    async summarizeChat(chat) {
        try {
            return await this.magi.echo.summarize(chat)
        } catch (error) {
            console.error(`Error in summryChat: ${error}`);
            return undefined;
        }
    }
    async summarizeText(content) {
        try {
            let prompt = `summarize this content,within 100 token,in same language as it:${content}`
            return (await (new OpenAichatApi()).postAsUser(prompt)).choices[0].message.content
        } catch (e) {
            return ""
        }
    }
}