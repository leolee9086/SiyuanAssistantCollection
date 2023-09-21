import { pluginInstance as plugin } from "../asyncModules.js"
import { 智能防抖 } from "./debouncer.js";
import logger from "../logger/index.js";
import "./documentEvents.js"
import { 渲染块标菜单 } from "../UI/menus/menuWrapper.js";
import { 事件注册表 } from "./eventTypeList.js";
import './wsChanel.js'
const eventBusProxy = new Proxy(plugin.eventBus, {
    get: (target, propKey, receiver) => {
        const origMethod = target[propKey];
        if (propKey === 'emit') {
            return (...args) => {
                const 事件名 = args[0];
                if (!事件注册表.查找事件({事件名})) {
                    logger.eventwarn(`未注册的事件: ${事件名}`,(new Error('Stack trace')).stack);
                }
                return origMethod.apply(target, args);
            };
        } else {
            return origMethod;
        }
    },
});
const { eventBus } = plugin
plugin.eventBus = eventBusProxy
const 开始自动索引 = () => {
    const 智能频率索引 = 智能防抖(() => { plugin.blockIndex.开始索引() }, (e) => { '索引耗时较长,已经自动调整频率' }, 5000);
    let backgroundTaskCount = 0;
    plugin.eventBus.on(
        'ws-main', (e) => {
            if(! plugin.statusMonitor.get('blockIndex','progress').$value){
                return
            }
            let d = e.detail
            if (d.cmd == 'transactions') {
                let { data } = d
                data.forEach(
                    op => {
                        op.doOperations.forEach(
                            doOperation => {
                                if (doOperation.action == 'delete') {
                                    let { id } = doOperation
                                    plugin.块数据集.删除数据([id])
                                }
                            }
                        )
                    }
                )
            } else if (d.cmd == 'backgroundtask') {
                backgroundTaskCount++;
                if (backgroundTaskCount >= 100) {

                    智能频率索引();
                    backgroundTaskCount = 0;
                }
            }
        }
    )
}
eventBus.on('blockIndexerReady', 开始自动索引)
eventBus.on("click-editortitleicon", async (event) => {
    渲染块标菜单(event, 'click-editortitleicon');
});
eventBus.on("click-blockicon", async (event) => {
    渲染块标菜单(event, 'click-blockicon');
});
document.addEventListener("keyup", (event) => {
    eventBus.emit('doc_keyup', event)
}, { capture: true, passive: true }
)

eventBus.on('click-editorcontent',()=>{
    let selectedText = window.getSelection().toString();
    if(selectedText){
        plugin.statusMonitor.set('editorStatus','selectedText',selectedText)
    }else{
        plugin.statusMonitor.set('editorStatus','selectedText','')

    }
})
