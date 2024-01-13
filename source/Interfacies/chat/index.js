import { initVueApp } from "../../UI/utils/componentsLoader.js"
export const docks ={
    aiChat:{
        init(element,data,tab){
            const app = initVueApp(
                import.meta.resolve('./UI/components/chatContainer.vue'),
                'rsscontent', {},
                'D:/思源主库/data/plugins/SiyuanAssistantCollection/source')
                console.error(app,element)
                app.mount(element)
        }
    }
}
export const tabs ={
    aiChat:{
        init(element,data,tab){
            const app = initVueApp(
                import.meta.resolve('./UI/components/chatContainer.vue'),
                'rsscontent', {},
                'D:/思源主库/data/plugins/SiyuanAssistantCollection/source')
            app.mount(element)
        }
    }
}
export const Emitter = class {
    channel='ai-chat'
    async onload(){
        
    }
}