import { sparkChat } from "./LLMAPIS/sparkChat.js";
import { MAGI } from './MAGI.js'
export class LanguageProcessor {
    constructor(persona) {
        this.magi = new MAGI(
            sparkChat,
            {

            }, persona
        )
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
            return (await (new sparkChat()).postAsUser(prompt)).choices[0].message.content
        } catch (e) {
            return ""
        }
    }
}