import { initVueApp } from "../../../../UI/utils/componentsLoader.js"
import { sac } from "../../../../asyncModules.js"
import { hasClosestByAttribute } from "../../../../utils/DOMFinder.js"
let handleClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    let closestRssAdapterName = hasClosestByAttribute(event.target, 'data-rss-adapter-source')
    if (closestRssAdapterName) {
        console.log(closestRssAdapterName.getAttribute('data-rss-adapter-source'))
        sac.事件管理器.emit('rss-ui', 'show-tab',{adapterSource: closestRssAdapterName.getAttribute('data-rss-adapter-source')})

    } else {
        let closestRssName = hasClosestByAttribute(event.target, 'data-rss-name')
        if (closestRssName) {
            sac.事件管理器.emit('rss-ui', 'show-tab', closestRssName.getAttribute('data-rss-name'))
        }
    }
}
export const buildRssListUI = async (container, rssList) => {
    if (container && container.element) {
        const app= initVueApp(import.meta.resolve('./rssSourceMonitor.vue'),'rssSourceMonitor')
        app.mount(container.element)
    }
}
let getMeta = async (rssname) => {
    return await sac.路由管理器.internalFetch('/search/rss/meta', {
        body: {
            name: rssname
        },
        method: "POST"
    })
}