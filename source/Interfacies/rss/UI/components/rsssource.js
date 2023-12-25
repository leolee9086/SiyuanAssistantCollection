import { sac } from "../../../../asyncModules.js"
import { initVueApp } from "../../../../UI/utils/componentsLoader.js"

export function 渲染rss添加界面(元素, rss内容源名称) {
    const app = initVueApp(import.meta.resolve('./rssCards.vue'),'rssSourceCards')
    app.mount(元素)
    sac.路由管理器.internalFetch('/search/rss/listAdapters/github', {
        method: "POST",
        body: {
            adapter: "GITHUB"
        }
    }).then(
        data=>{
            sac.statusMonitor.set('rss','sources',rss内容源名称,data.body)
        }
    )
}