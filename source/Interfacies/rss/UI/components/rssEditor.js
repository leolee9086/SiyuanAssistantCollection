import { sac } from "../../../../asyncModules.js"
import { initVueApp } from "../../../../UI/utils/componentsLoader.js"
export const 渲染rss内容=(容器元素,rss内容源名称)=>{
    console.log(容器元素,rss内容源名称)
    if(rss内容源名称==='$add-new-rss'){
        console.log('添加rss')
    }
    sac.路由管理器.internalFetch('/search/rss/enable', {
        body: {
            name:rss内容源名称
        }, method: 'POST'
    }).then(
        data => {     
            const app = initVueApp(import.meta.resolve('./rssEditor.vue'),'rsscontent',{},'D:/思源主库/data/plugins/SiyuanAssistantCollection',{data:data.body})
            app.mount(容器元素)
        }
    )
}