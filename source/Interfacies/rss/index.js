import { sac } from "../../asyncModules.js"
import { initVueApp } from "../../UI/utils/componentsLoader.js"
import { buildRssListUI } from "./UI/components/rsscards.js"
import { 渲染rss内容 } from "./UI/components/rssEditor.js"
import { 渲染rss添加界面 } from "./UI/components/rsssource.js"
let rssList = []
let currentPage = 1
export const Emitter = class {
    channel = 'rss-ui'
    async onload() {
        sac.getOpenedTab().SAC_Tab.forEach(
            tab => {
                if (tab.data.channel && tab.data.channel === this.channel) {
                    if (tab.data.name) {
                        渲染rss内容(tab.element.querySelector('#sac-interface'), tab.data.name)
                    } else if (tab.data.source) {
                        渲染rss添加界面(tab.element.querySelector('#sac-interface'), tab.data.source)
                    }
                }
            }
        )
        let container = await sac.statusMonitor.get('RssDockConainer', 'main').$value
        if (container) {
            initRssUI(container)
        }
    }
    ['show-tab'] = (e) => {
        console.log(e)
        if (e.adapterSource) {
            this.emit('open-tab', {
                icon: 'iconRSS',
                title: `从${e.adapterSource}添加rss`,
                data: {
                    type: 'rss-tab-source',
                    source: e.adapterSource
                }
            })
        }
        //这个方法是被注入的集
        this.emit('open-tab', {
            icon: 'iconRSS',
            title: e,
            data: {
                type: 'rss-tab-content',
                name: e
            }
        })
    }
    ['install-adapter']=async(e)=>{
        await sac.路由管理器.internalFetch('/search/rss/install', {
            body: e, method: 'POST'
        })
    }
    ['tab-inited'] = async (e) => {
        if (e.data.name) {
            渲染rss内容(e.element.querySelector('#sac-interface'), e.data.name)
        } else if (e.data.source) {
            渲染rss添加界面(e.element.querySelector('#sac-interface'), e.data.source)
        }
    }
  
    ['@main-rss-dock-conainer-inited'] = async (e) => {
        let rssListRes = await sac.路由管理器.internalFetch('/search/rss/list', {
            body: {
                page: currentPage
            }, method: 'POST'
        })
        if (rssListRes.body && JSON.stringify(rssListRes.body.data) !== JSON.stringify(rssList)) {
            rssList = rssListRes.body.data
            buildRssListUI(e.element.querySelector('#sac-interface'), rssList)
            sac.getOpenedTab().SAC_Tab.forEach(
                tab => {
                    if (tab.data.channel && tab.data.channel === this.channel) {
                        if (tab.data.name) {
                            渲染rss内容(tab.element.querySelector('#sac-interface'), tab.data.name)
                        } else if (tab.data.source) {
                            渲染rss添加界面(tab.element.querySelector('#sac-interface'), tab.data.source)
                        }
                    }
                }
            )
        }
    }
}
export const tabs = {
    "rssContent":{
        init:(element,data,tab)=>{
            console.log(element)
            initVueApp(
                import.meta.resolve('./UI/components/rssContent.vue'),
                'rssContent',
                {}, 'D:/思源主库/data/plugins/SiyuanAssistantCollection/source',{feed:data.feed}
            ).mount(element)
        }
    }
}

async function initRssUI(container) {
    let rssListRes = await sac.路由管理器.internalFetch('/search/rss/list', {
        body: {
            page: currentPage
        }, method: 'POST'
    })
    if (rssListRes.body && JSON.stringify(rssListRes.body.data) !== JSON.stringify(rssList)) {
        rssList = rssListRes.body.data
        buildRssListUI(container, rssList)
        sac.getOpenedTab().SAC_Tab.forEach(
            tab => {
                console.log(tab)
                if (tab.data.channel && tab.data.channel === Emitter.channel) {

                    if (tab.data.name) {
                        渲染rss内容(tab.element.querySelector('#sac-interface'), tab.data.name)
                    } else if (tab.data.source) {
                        渲染rss添加界面(tab.element.querySelector('#sac-interface'), tab.data.source)
                    }
                }
            }
        )
    }
}
