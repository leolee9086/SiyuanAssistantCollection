import { sac } from "../../asyncModules.js"
import { initVueApp } from "../../UI/utils/componentsLoader.js"

export const tabs = {
    "packageManage":{
        init:(element,data,tab)=>{
        
                    const app = initVueApp(
                        import.meta.resolve('../rss/UI/components/rssAdapterCards.vue'),
                        'rsscontent', {},
                        'D:/思源主库/data/plugins/SiyuanAssistantCollection/source', { ...data })
                    app.mount(element)
            
        }
    }
}
export const Emitter=class{
    channel="admin"
}
