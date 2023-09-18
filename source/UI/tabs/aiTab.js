import { plugin,clientApi } from "../../asyncModules.js";
import throneManager from '../../throne/index.js'
let tabGroups = plugin.statusMonitor.get("aiTabContainer")

if(plugin.statusMonitor.get("aiTabContainer")){
    for(let persona in tabGroups){
        let tabs = tabGroups[persona]
        tabs.forEach(
            tab=>{
                try{
                    createAiTab(tab)

                }catch(e){
                    console.error(e)
                }
            }
        )
    }
}
plugin.eventBus.on('TabContainerInited',(event)=>{
    console.log(event.detail)
     createAiTab(event.detail)
})
function createAiTab(tab){
    console.log(tab)
    throneManager.buildDoll( plugin.configurer.get('聊天工具设置', '默认AI')).then(
        doll=>{
            doll.createInterface(
                {
                    type: 'textChat',
                    describe: '一个HTML用户界面,用于向用户展示图文信息',
                    container: tab.element.querySelector('#ai-chat-interface'),
                }
            );
        }
    )
}
plugin.eventBus.on("open-siyuan-url-plugin",(event)=>{
    console.log(event.detail)
    const tab = clientApi.openTab({
            app: plugin.app,
            custom: {
                icon: "iconFace",
                title: "paimon",
                data: {
                    persona: "paimon",
                },
                fn:plugin.aiTabContainer

            },
    })
    console.log(tab)
})

clientApi.openTab({
    app: plugin.app,
    custom: {
        icon: "iconFace",
        title: "paimon",
        data: {
            persona: "paimon",
        },
        fn:plugin.aiTabContainer

    },
})