import { sac } from "../../asyncModules.js"
import { initVueApp } from "../../UI/utils/componentsLoader.js"
export const Emitter = class {
    channel = 'rss-ui'
    async onload() {

    }
    ['install-adapter'] = async (e) => {
        await sac.路由管理器.internalFetch('/search/rss/install', {
            body: e, method: 'POST'
        })
    }
}
export const tabs = {
    "rssAdaptersGithub": {
        init: (element, data, tab) => {
            const app = initVueApp(
                import.meta.resolve('./UI/components/rssAdapterCards.vue'),
                'rsscontent', {},
                'D:/思源主库/data/plugins/SiyuanAssistantCollection/source')
            app.mount(element)

        }
    },
    "rssEditor": {
        init: (element, data, tab) => {
            
            sac.路由管理器.internalFetch('/search/rss/getConfig', {
                body: {
                    packageName: data.name
                }, method: 'POST'
            }).then(
                res => {
                    const app = initVueApp(
                        import.meta.resolve('./UI/components/rssEditor.vue'),
                        'rsscontent', {},
                        'D:/思源主库/data/plugins/SiyuanAssistantCollection/source', {meta:data, config: res.body })
                    app.mount(element)
                }
            )
        }
    },
    "rssGrid": {
        init: (element, data, tab) => {
            console.log(element)
            initVueApp(
                import.meta.resolve('./UI/components/rssGrid.vue'),
                'rssContent',
                {}, 'D:/思源主库/data/plugins/SiyuanAssistantCollection/source', { feed: data.feed }
            ).mount(element)
        }
    },
    "rssContent": {
        init: (element, data, tab) => {
            console.log(element, data, tab)
            initVueApp(
                import.meta.resolve('./UI/components/rssContent.vue'),
                'rssContent',
                {}, sac.localPath + '/source',
                { ...data }
            ).mount(element)
        }
    }
}
export const dialogs = {
    'initFeed': {
        init: (dialog) => {
            console.log(dialog)
            initVueApp(
                import.meta.resolve('./UI/components/rssFeedBuilder.vue'),
                'rssBuilder',
                {},
                sac.localPath + '/source',
                { ...dialog.data }
            ).mount(
                dialog.element.querySelector('.b3-dialog__body')
            )
        },
        prepare: (data) => {
            console.log(data)
            return {
                title: data.router.endpoint,
                content: "",
                width: '600px',
                height: 'auto',
                transparent: true,
                disableClose: false,
                disableAnimation: false
            }
        }
    },
    'addAdapter':{
        init(dialog){
            initVueApp(
                import.meta.resolve('./UI/components/htmlPackageSourceDialog.vue'),
                'rssBuilder',
                {},
                sac.localPath + '/source',
                { ...dialog.data }
            ).mount(
                dialog.element.querySelector('.b3-dialog__body')
            )
        },
        prepare:(data)=>{
            return{
                title:"添加集市源",
                content: "",
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
    rssSourceMonitor: {
        init: async (element) => {
            console.log(element)
            const app = initVueApp(
                import.meta.resolve('./UI/components/rssSourceMonitor.vue'),
                'rssSourceMonitor', 
                {}, 
                sac.localPath + '/source',
            )
            app.mount(element)

        }
    }
}

