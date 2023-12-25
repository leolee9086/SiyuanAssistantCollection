import { initVueApp } from "../../../../UI/utils/componentsLoader.js"

export const buildRssListUI = async (container, rssList) => {
    if (container && container.element) {
        const app= initVueApp(import.meta.resolve('./rssSourceMonitor.vue'),'rssSourceMonitor')
        app.mount(container.element)
    }
}
