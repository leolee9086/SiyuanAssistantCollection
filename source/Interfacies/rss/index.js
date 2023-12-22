import { sac } from "../../asyncModules.js"
import { buildRssListUI } from "./UI/components/rsscards.js"
import { 渲染rss内容 as 渲染rss内容 } from "./UI/components/rsscontents.js"
let rssList = []
let currentPage = 1
export const Emitter = class {
    channel = 'rss-ui'
    async onload() {
        sac.getOpenedTab().SAC_Tab.forEach(
            tab => {
                if (tab.data.channel && tab.data.channel === this.channel) {
                    渲染rss内容(tab.element.querySelector('#sac-interface'), tab.data.name)
                }
            }
        )
        let container = await sac.statusMonitor.get('RssDockConainer', 'main').$value
        if(container){
            initRssUI(container)
        }
    }
    ['show-tab'] = (e) => {
        
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
    ['tab-inited'] = async (e) => {
        渲染rss内容(e.element.querySelector('#sac-interface'), e.data.name)
    }
    ['@main-rss-server-ready'] = async (e) => {
        let container = await sac.statusMonitor.get('RssDockConainer', 'main').$value
        if(container){
            initRssUI(container)
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
            buildRssListUI(container, rssList)
            sac.getOpenedTab().SAC_Tab.forEach(
                tab => {
                    if (tab.data.channel && tab.data.channel === this.channel) {
                        渲染rss内容(tab.element.querySelector('#sac-interface'), tab.data.name)
                    }
                }
            )
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
                    
                    渲染rss内容(tab.element.querySelector('#sac-interface'), tab.data.name)
                }
            }
        )
    }
}
