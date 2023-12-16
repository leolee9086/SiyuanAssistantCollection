import { sac } from "../../asyncModules.js"
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
                    if (container && container.element) {
                        container.element.querySelector('#SAC-RSS-List').innerHTML = rssList.map(
                            item => `
<div class="fn__flex-1 fn__flex b3-card b3-card--wrap">
    <div class="b3-card__body  style="font-size:small !important;padding:0">
        <div class="b3-card__img">
            <img src="${item}" onerror="this.src='https://oss.b3logfile.com/package/winter60/plugin-flomo-sync@4cac8ddb496574f7b8fb7e2b91604171d1dcba99/preview.png?imageView2/2/w/436/h/232'">
        </div>
        <div class="fn__flex-1 fn__flex-column">
            <div class="b3-card__info fn__flex-1">
                ${item} <span class="ft__on-surface ft__smaller">feed</span>
                    <div class="b3-card__desc" title="${item.title}">
                        ${item.description}
                    </div>
            </div> 
        </div>
    </div>

</div>
`
                        ).join('\n')
                    }
                }
            }
        },
    ]
}