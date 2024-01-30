import { plugin,clientApi } from "../../asyncModules.js";
import throneManager from '../../throne/index.js'
import logger from '../../logger/index.js'
let tabGroups = plugin.statusMonitor.get("aiTabContainer").$value
if(plugin.statusMonitor.get("aiTabContainer").$value){
    for(let persona in tabGroups){
        let tabs = tabGroups[persona]
        tabs.forEach(
            tab=>{
                try{
                    createAiTab(tab)

                }catch(e){
                    logger.taberror(e)
                }
            }
        )
    }
}

function createAiTab(tab){
    logger.AiTablog(tab)
    console.log(tab)
    throneManager.buildDoll( plugin.configurer.get('聊天工具设置', '默认AI').$value).then(
        async doll=>{
            doll.createInterface(
                {
                    type: 'textChat',
                    describe: '一个HTML用户界面,用于向用户展示图文信息',
                    container:await tab.element.querySelector('#ai-chat-interface'),
                }
            );
        }
    )
}
plugin.eventBus.on('TabContainerInited',(event)=>{
    logger.AiTablog(event.detail)
     createAiTab(event.detail)
})
plugin.eventBus.on("open-siyuan-url-plugin",(event)=>{
    logger.AiTablog(event.detail)

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
    logger.AiTablog(tab)
})
plugin.eventBus.on("openAiTab",(event)=>{
    logger.AiTablog(event.detail)

    const tab = clientApi.openTab({
            app: plugin.app,
            custom: {
                icon: "iconFace",
                title:  event.detail,
                data: {
                    persona: event.detail,
                },
                fn:plugin.aiTabContainer
            },
    })
    logger.AiTablog(tab)
})

