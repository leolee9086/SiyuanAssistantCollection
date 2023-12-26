import { sac } from "../../asyncModules.js"
import { initVueApp } from "../../UI/utils/componentsLoader.js"
import { 渲染rss内容 } from "./UI/components/rssEditor.js"
import { 渲染rss添加界面 } from "./UI/components/rsssource.js"
export const Emitter = class {
    channel = 'rss-ui'
    async onload() {

    }
    ['install-adapter']=async(e)=>{
        await sac.路由管理器.internalFetch('/search/rss/install', {
            body: e, method: 'POST'
        })
    }
}
export const tabs = {
    "rssEditor":{
        init:(element,data,tab)=>{
            console.log(data)
            sac.路由管理器.internalFetch('/search/rss/enable', {
                body: {
                    name: data.name
                }, method: 'POST'
            }).then(
                data => {
                    const app= initVueApp(
                        import.meta.resolve('./UI/components/rssEditor.vue'), 
                        'rsscontent', {}, 
                        'D:/思源主库/data/plugins/SiyuanAssistantCollection/source', { data: data.body })
                    app.mount(element)
                }
            )    
        }
    },
    "rssGrid":{
        init:(element,data,tab)=>{
            console.log(element)
            initVueApp(
                import.meta.resolve('./UI/components/rssGrid.vue'),
                'rssContent',
                {}, 'D:/思源主库/data/plugins/SiyuanAssistantCollection/source',{feed:data.feed}
            ).mount(element)
        }
    },
    "rssContent":{
        init:(element,data,tab)=>{
            console.log(element,data,tab)
            initVueApp(
                import.meta.resolve('./UI/components/rssContent.vue'),
                'rssContent',
                {}, 'D:/思源主库/data/plugins/SiyuanAssistantCollection/source',{...data}
            ).mount(element)
        }
    }
}
export const dialogs={
    'initFeed':{
        init:(dialog)=>{
            console.log(dialog)
            initVueApp(
                import.meta.resolve('./UI/components/rssFeedBuilder.vue'),
                'rssBuilder',
                {},
                sac.localPath+'/source',
                {...dialog.data}
            ).mount(
                dialog.element.querySelector('.b3-dialog__body')
            )
        },
        prepare:(data)=>{
            console.log(data)
            return {
                title:data.router.endpoint,
                content:"",
                width: '600px',
                height: 'auto',
                transparent: true,
                disableClose: false,
                disableAnimation: false        
            }
        }
    }
}
export const docks = {
    rssSourceMonitor:{
        init:async(element)=>{
            console.log(element)
            const app= initVueApp(import.meta.resolve('./UI/components/rssSourceMonitor.vue'),'rssSourceMonitor')
            app.mount(element)
    
        }
    }
}

