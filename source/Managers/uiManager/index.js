import { sac } from "../../asyncModules.js"
export const useTabs = (tabs, emitter) => {
    sac.eventBus.on(emitter.channel + '-' + 'tab-opened', (e) => {
        for (let tab in tabs) {
            let model = e.detail
            if (model.data.name = tab.name) {
                tab.init(model)
            }
        }
    })
}