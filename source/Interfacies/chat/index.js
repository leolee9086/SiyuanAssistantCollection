import { initVueApp } from "../../UITools/loader/VueComponentsLoader.js"
import { sac } from "../../asyncModules.js"
import { handleBlockIconClick } from "./noteChat/chatmenu.js"
import { aiPersonaPackage } from "./package/index.js"
export const docks ={
    aiChat:{
        init(element,data,tab){
            const app = initVueApp(
             //   import.meta.resolve('./UI/components/chatContainer.vue'),
             import.meta.resolve('./UI/components/aiSelector.vue'), 
             'rsscontent', {},
                'D:/思源主库/data/plugins/SiyuanAssistantCollection/source')
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
        console.log(sac.statusMonitor.get('packages','sac-ai-persona').$value)
    }
    [`@main-click-blockicon`]=handleBlockIconClick
    
}

export const packages =[aiPersonaPackage]