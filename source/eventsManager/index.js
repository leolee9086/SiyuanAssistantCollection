import { pluginInstance as plugin, Constants, kernelApi,clientApi } from "../asyncModules.js"
import { 智能防抖 } from "./debouncer.js";
import logger from "../logger/index.js";
import "./documentEvents.js"
import { 渲染块标菜单 } from "../UI/menus/menuWrapper.js";
import { 事件注册表 } from "./eventTypeList.js";
import './wsChanel.js'
import { setSync } from "../fileSysManager/index.js";
import path from '../polyfills/path.js';
import fs from "../polyfills/fs.js";
import buildMenu from "../UI/dialogs/fakeMenu.js";
import { string2DOM } from "../UI/builders/index.js";

const eventBusProxy = new Proxy(plugin.eventBus, {
    get: (target, propKey, receiver) => {
        const origMethod = target[propKey];
        if (propKey === 'emit') {
            return (...args) => {
                const 事件名 = args[0];
                if (!事件注册表.查找事件({ 事件名 })) {
                    logger.eventwarn(`未注册的事件: ${事件名}`, (new Error('Stack trace')).stack);
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
            if (!plugin.statusMonitor.get('blockIndex', 'progress').$value) {
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

eventBus.on('click-editorcontent', () => {
    let selectedText = window.getSelection().toString();
    if (selectedText) {
        plugin.statusMonitor.set('editorStatus', 'selectedText', selectedText)
    } else {
        plugin.statusMonitor.set('editorStatus', 'selectedText', '')

    }
})
eventBus.on('settingChange', async (e) => {
    let { detail } = e
    if (detail.name === "向量工具设置.同步时忽略向量存储文件夹") {
        await setSync('public/onnxModels/**', detail.value)
        window.location.reload()
    }
    if (detail.name === "向量工具设置.同步时忽略向量模型文件夹") {
        await setSync('public/vectorStorage/**', detail.value)
        window.location.reload()
    }
    if (detail.name === "向量工具设置.默认文本向量化模型") {
        window.location.reload()
    }
    if (detail.name === "向量工具设置.向量保存格式") {
        await plugin.块数据集.迁移数据(detail.value)
        window.location.reload()
    }
    if (detail.name === "菜单.显示关键词菜单") {
        if(detail.value){
            buildMenu('SAC')
        }
    }
})
eventBus.on('sac-open-menu-hintmenu',()=>{
    plugin.statusMonitor.set('菜单', '关键词菜单', '初次显示',false)
        buildMenu('SAC')
    
})
eventBus.on('sac-open-menu-aichatmessage', async (e) => {
    let { detail } = e
    let { menu, doll, message, userInput } = detail
    console.log(doll)
    let html = string2DOM(plugin._lute.Md2HTML(message))
    let linkSpans = Array.from(html.querySelectorAll('a'))
    for(let link of linkSpans){
        const idShortCode = link.getAttribute('href').replace('ref:', '').split('-').pop().trim();
        const foundLink = Object.keys(doll.ghost.linkMap).find(key => key.endsWith(idShortCode));
        if (foundLink) {
            link.setAttribute('data-href', combinedLinkMap[foundLink]);
        }
    }
    message=plugin._lute.HTML2Md(message)
    menu.addItem({
        icon: "iconSparkles",
        label: "插入到当前块之后",
        click: () => {
            const context = plugin.statusMonitor.get('runtime', 'currentContext').$value
            if (context) {
                context.blocks[0].insertAfter(`## ${userInput}`)
                context.blocks[0].insertAfter(`${message}`)

            }
        }
    },
    )
    menu.addItem({
        icon: "iconSparkles",
        label: "插入到当前块之前",
        click: () => {
            const context = plugin.statusMonitor.get('runtime', 'currentContext').$value
            if (context) {
                context.blocks[0].insertBefore(`${message}`)
            }
        }
    },
    )
})
eventBus.on(`openHelp-plugin-${plugin.name}`, async () => {
    const helpID = Constants.HELP_PATH[siyuan.config.lang]
   // kernelApi.removeNotebook.sync({ notebook: helpID, callback: Constants.CB_MOUNT_REMOVE })
    let pluginHelpPath = Constants.Plugin_Help_path[siyuan.config.lang] || Constants.Plugin_Help_path['zh_CN']
    let pluginHelpName = Constants.Plugin_Help_name[siyuan.config.lang] || Constants.Plugin_Help_name['zh_CN']

    let bin = await fs.readFile(path.join(plugin.selfPath, 'assets', 'help', pluginHelpPath))
    await kernelApi.openNotebook({ notebook: helpID })
    let data = new FormData();
    let blob = new Blob([bin], {
        type:  "application/zip",
      });
    let file = new File([blob], pluginHelpPath, {
        lastModified: Date.now(),
    });
    data.append("file", file);
    data.append("toPath", '/');
    data.append("notebook", helpID);
    await kernelApi.importSY(data)
    setTimeout(async()=>{
        let sql = `select * from blocks where box ='${helpID}' and hpath = '/${pluginHelpName}'`
        let blocks = await kernelApi.sql({stmt:sql})
        if(blocks[0]){
            await clientApi.openTab({
                app: plugin.app,
                doc: {
                    id: blocks[0].id,
                }
            });
        }
    },3000)
})
