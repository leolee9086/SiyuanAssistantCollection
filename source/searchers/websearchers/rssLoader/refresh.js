import { parseRss } from './paseLocal.js'
import { plugin } from '../../runtime.js'
let rss设置 = plugin.configurer.get('RSS').$value
for (let rssKey in rss设置) {
    let rss = rss设置[rssKey];
    if (rss.名称 && rss.路径) {
        // 监听事件
       // plugin.eventBus.on('RssDockConainerInited', async(data) => {
        //    data.element.querySelector('#SAC-RSS-List').innerHTML = await parseRss(rss.路径).state
        //})
        // 解析RSS并渲染
        let ctx = await parseRss(rss.路径)
        plugin.statusMonitor.get('RssDockConainer', 'main').$value.element.querySelector('#SAC-RSS-List').innerHTML += `<div class="rss-card">
        <h2><a href="${ctx.state.data.link}">${ctx.state.data.title}</a></h2>
        <p>${ctx.state.data.description}</p>
        </div>
        `
        console.log(ctx)
     /*   ctx.state.data.item.forEach(
            ctx => {
                plugin.statusMonitor.get('RssDockConainer', 'main').$value.element.querySelector('#SAC-RSS-List').innerHTML += `
                <div class="rss-card">
                    <h3><a href="${ctx.link}">${ctx.title}</a></h3>
                    <p>${ctx.description}</p>
                </div>`
            }
        )*/
    }
}


console.log(plugin.statusMonitor.get('RssDockConainer', 'main').$value)