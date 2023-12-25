import { sac } from "../../asyncModules.js"
export const useTabs = (tabs, emitter) => {
    console.log(tabs)
    sac.eventBus.on(emitter.channel + '-' + 'open-tab', (e) => {
        sac.eventBus.emit('open-tab', {
            emitter: emitter,
            title:e.detail.title,
            icon:e.detail.icon,
            data: {
                data: JSON.parse(JSON.stringify(e.detail))
            }
        })
    })
    sac.eventBus.on(emitter.channel + '-' + 'tab-opened', (e) => {
        console.log(e)
        if(tabs[e.detail.data.type]){
            tabs[e.detail.data.type].init(e.detail.element.querySelector("#sac-interface"),e.detail.data,e.detail)
        }
    })
}