import { sac } from "../../asyncModules.js"
import { buildRssListUI } from "./UI/components/rsscards.js"
import { 渲染rss内容 as 渲染rss内容 } from "./UI/components/rsscontents.js"
let rssList = []
let currentPage = 1
export const Emitter = class {
    channel = 'rss-ui'
    jobs = [
        {
            schedule: '* * * * * *', task: async () => {
                console.log('每秒钟执行一次rss获取')
                let rssListRes = await sac.路由管理器.internalFetch('/search/rss/list', {
                    body: {
                        page: currentPage
                    }, method: 'POST'
                })
                console.log(rssListRes)
                if (rssListRes.body && JSON.stringify(rssListRes.body.data) !== JSON.stringify(rssList)) {
                    rssList = rssListRes.body.data
                    console.log('订阅源改变')
                    let container = await sac.statusMonitor.get('RssDockConainer', 'main').$value
                    buildRssListUI(container, rssList)
                }
            }
        },
    ];
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
        渲染rss内容( e.element.querySelector('#sac-interface'),  e.data.name)
    }
}

