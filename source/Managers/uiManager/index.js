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
    console.log(sac.getOpenedTab())
    let OpenedTabs = sac.getOpenedTab()
    Object.keys(OpenedTabs).forEach(
        tabType=>{
            let tabArray = OpenedTabs[tabType];
            tabArray.forEach(
                model=>{
                    if(model.data.channel=== emitter.channel&&tabs[model.data.type]){
                        tabs[model.data.type].init(model.element.querySelector("#sac-interface"),model.data,model)
                    }
                }
            )
        }
    )
}
