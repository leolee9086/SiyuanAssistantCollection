import { clientApi } from "../../../asyncModules.js"
export const openTipsContextMenu=(menuContent,name,position)=>{
    let menu = new clientApi.Menu(name)
    menuContent.forEach(
       item=> menu.addItem(item)
    )
    menu.open(position)
}
export function 打开tips右键菜单(e, item) {
    if(!item.contextMenu){
        return
    }
    let 鼠标位置 = { y: e.clientY, x: e.clientX + 10 }
    let 菜单名称 = 'sac-tips-context-menu'
    openTipsContextMenu(item.contextMenu, 菜单名称, 鼠标位置)
}