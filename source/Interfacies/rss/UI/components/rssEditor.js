import { sac } from "../../../../asyncModules.js"
import { initVueApp } from "../../../../UI/utils/componentsLoader.js"
export const 渲染rss内容 = (容器元素, rss内容源名称) => {
    console.log(容器元素, rss内容源名称)
    let inited = false
    if (!容器元素.getAttribute('data-sac-ui-type')) {
        容器元素.setAttribute('data-sac-ui-type', 'rssEditor')
    }
    else if (容器元素.getAttribute('data-sac-ui-type') === 'rssEditor') {
        inited = true
    } else {
        容器元素.setAttribute('data-sac-ui-type', 'rssEditor')
        容器元素.innerHTML = ""
    }
    if (!inited) {
        sac.路由管理器.internalFetch('/search/rss/enable', {
            body: {
                name: rss内容源名称
            }, method: 'POST'
        }).then(
            data => {
                const app= initVueApp(import.meta.resolve('./rssEditor.vue'), 'rsscontent', {}, 'D:/思源主库/data/plugins/SiyuanAssistantCollection/source', { data: data.body })
                app.mount(容器元素)

            }
        )
    }
}