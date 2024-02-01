import { clientApi } from "../../../asyncModules.js"
import buildMenu from "../../../UITools/palette/index.js"
import { 获取选区屏幕坐标 } from "../../../utils/rangeProcessor.js"
import { string2DOM } from "../../../UITools/builders/index.js"
import { sac } from "../../../asyncModules.js"
import { hasClosestByAttribute } from "../../../utils/DOM/DOMFinder.js"
export const openTipsContextMenu = (menuContent, name, position) => {
    let menu = new clientApi.Menu(name)
    menuContent.forEach(
        item => menu.addItem(item)
    )
    menu.open(position)
}
export function 打开tips右键菜单(e, item) {
    if (!item.contextMenu) {
        return
    }
    let 鼠标位置 = { y: e.clientY, x: e.clientX + 10 }
    let 菜单名称 = 'sac-tips-context-menu'
    openTipsContextMenu(item.contextMenu, 菜单名称, 鼠标位置)
}

let 命令面板
export function 显示光标提示菜单(signal) {
    let 光标坐标 = 获取选区屏幕坐标()
    命令面板 = buildMenu('sac') || 命令面板
    if (!命令面板) {
        return
    }
    if (!命令面板.搜索输入框) {
        let 搜索输入框 = string2DOM(`<div class="fn__space"></div><input/>`)
        命令面板.搜索输入框 = 搜索输入框.querySelector('input')
        命令面板.headElement.appendChild(搜索输入框)
        命令面板.搜索输入框.addEventListener('input', 刷新动作菜单)
        命令面板.搜索输入框.addEventListener('change', 刷新动作菜单)
    }
    命令面板 && 命令面板.moveTo({ x: 光标坐标.left + 32, y: 光标坐标.top + 32 })
    命令面板.bodyElement.style.maxHeight = `calc(100vh - ${光标坐标.top + 200}px)`
    !命令面板.prepared ? 命令面板.bodyElement.addEventListener('click', (e) => {
        let button = hasClosestByAttribute(e.target, 'data-action-id')
        let actionItem = sac.statusMonitor.get('tips', 'current').$value.find(item => {
            return item.actionId === button.getAttribute('data-action-id')
        })
        if (!button.getAttribute("data-actionItem-id")) {
            actionItem.$action()
        } else {
            actionItem.contextMenu.find(menuItem => {
                return menuItem.id === button.getAttribute("data-actionItem-id")
            }).click()
        }
    }) : null
    命令面板.prepared = true
    刷新动作菜单(signal)
}
function 刷新动作菜单(signal) {
    命令面板.bodyElement.innerHTML = ""

    requestIdleCallback(
        () => {
            let id = sac.statusMonitor.get('context', 'editor').$value.blockID;
            let HTML = ''
            sac.statusMonitor.get('tips', 'current').$value.filter(item => {
                return (item.action || item.contextMenu)
                    &&
                    item.targetBlocks
                    &&
                    item.targetBlocks.includes(id)
                    && (item.description.indexOf(命令面板.搜索输入框.value) > -1 || item.contextMenu && item.contextMenu.find(menuItem => menuItem.label.indexOf(命令面板.搜索输入框.value) > -1))

            }).forEach(
                item => {
                    if (signal && signal.aborted) {
                        return
                    }
                    if (item.action) {
                        HTML += `<div class="b3-menu__item" data-action-id="${item.actionId}">${item.actionDescription || item.description}</div>`
                    }
                    if (item.contextMenu) {
                        item.contextMenu.forEach(
                            menuItem => {
                                if (menuItem.label.indexOf(命令面板.搜索输入框.value) > -1) {
                                    HTML += `<div class="b3-menu__item" data-action-id="${item.actionId}" data-actionItem-id="${menuItem.id}">
                                                    ${menuItem.label}
                                                </div>`
                                }
                            }
                        )
                    }
                }
            )
            let frag = string2DOM(HTML)
            命令面板.bodyElement.appendChild(frag)
        }
    )

}