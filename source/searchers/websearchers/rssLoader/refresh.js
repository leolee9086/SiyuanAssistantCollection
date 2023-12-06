import { parseRss } from './paseLocal.js'
import { plugin } from '../../../asyncModules.js'
let rss设置 = plugin.configurer.get('RSS').$value

console.log(rss设置)
plugin.eventBus.on('RssDockConainerInited', async(data) => {
    data.element.querySelector('#SAC-RSS-List').innerHTML=await parseRss('/zhihu/daily').state
})
let ctx = await parseRss('/zhihu/daily')
plugin.statusMonitor.get('RssDockConainer', 'main').$value.element.querySelector('#SAC-RSS-List').innerHTML= `<div class="rss-card">
<h2><a href="${ctx.state.data.link}">${ctx.state.data.title}</a></h2>
<p>${ctx.state.data.description}</p>
</div>
`
ctx.state.data.item.forEach(
ctx => {
    plugin.statusMonitor.get('RssDockConainer', 'main').$value.element.querySelector('#SAC-RSS-List').innerHTML += `
    <div class="rss-card">
        <h3><a href="${ctx.link}">${ctx.title}</a></h3>
        <p>${ctx.description}</p>
    </div>`
})



console.log(plugin.statusMonitor.get('RssDockConainer', 'main').$value)