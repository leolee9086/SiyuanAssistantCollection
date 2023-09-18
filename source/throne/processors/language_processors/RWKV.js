import { openAiChat } from './LLMAPIS/openAIchat.js'
import { MAGI } from './MAGI.js'
import { configer } from '../util/config.js'
let options = await configer.getConfig('rwkv')

export class LanguageProcessor {
    constructor(persona) {
        magi.setPersona(persona)
        this.magi = new MAGI(new OpenAichatApi(


        ), {
            apiBaseURL: "http://127.0.0.1:8000/v1",

            ...options
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
    
    async summryChat(chat) {
        try {
            return await this.magi.echo.summry(chat)
        } catch (error) {
            console.error(`Error in summryChat: ${error}`);
            return undefined;
        }
    }
}