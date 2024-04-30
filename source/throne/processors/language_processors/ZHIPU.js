import { zhipuaiChat } from "./LLMAPIS/zhipuaiChat.js";
import { MAGI } from './MAGI.js'
import { EventEmitter } from "../../../eventsManager/EventEmitter.js";
export class LanguageProcessor extends EventEmitter{
    constructor(persona) {
        super()
        this.magi = new MAGI(
            zhipuaiChat,
            {
                chatMode:'simple'
            }, persona
        )
        this.magi.on('aiTextData',(t)=>{
            console.log(t)
        })
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
            return (await (new zhipuaiChat()).postAsUser(prompt)).choices[0].message.content
        } catch (e) {
            return ""
        }
    }
}