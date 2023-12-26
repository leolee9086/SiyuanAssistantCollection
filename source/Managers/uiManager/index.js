import { clientApi, sac } from "../../asyncModules.js"
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
export const useDialogs=(dialogs,emitter)=>{
    sac.eventBus.on(emitter.channel+'-'+'open-dialog',(e)=>{
        let data = e.detail
        let {type}=data
        if(dialogs[type]){
            let config = dialogs[type].prepare(data)
            config.destroyCallback=config.destroyCallback||dialogs[type].destroyCallback
            const dialog = new clientApi.Dialog(config,()=>{
            })
            dialog.data =data
            dialogs[type].init(dialog)
            let _dialogs = sac.statusMonitor.get('dialogs',emitter.channel,type).$value||[]
            _dialogs.push(dialog)
            sac.statusMonitor.set('dialogs',emitter.channel,type,_dialogs)
        }     
    })
}
//dock必须首先声明,因此这里需要做一次判定
export const useDocks=(docks,emitter)=>{
    let containers =sac.statusMonitor.get('docks',emitter.channel).$value
    console.log(containers)
    for(let container of containers){
        console.log(container.data.name,docks[container.data.name])
        if(docks[container.data.name]){
            docks[container.data.name].init(container.element.querySelector("#sac-interface"))
        }
    } 
    sac.eventBus.on(emitter.channel+'-'+'dock-container-inited',(e)=>{
        let container=e.detail
        console.log(container)
        if(docks[container.data.name]){
            docks[container.data.name].init(container.element.querySelector("#sac-interface"))
        }
    }) 
}   