import { pluginInstance as plugin } from '../asyncModules.js'
export { plugin as plugin }
import { clientApi } from '../asyncModules.js'
export { clientApi as clientApi }
import  kernelApi  from '../polyfills/kernelApi.js'
export { kernelApi as kernelApi}
//用于各类弹窗和对话框
import * as 弹窗 from './dialogs.js'
import { 开始渲染 as 开始渲染token菜单 } from './tokenMenu.js'
import { 渲染块标菜单 } from './menus/menuWrapper.js'
//用于添加顶栏按钮
import './topBar.js'
//用于创建对话侧栏
import './docks/mainAiDock.js'
//用于创建tips侧栏
import './docks/TipsDock.js'
//用于创建对话页签
import './tabs/aiTab.js'
//用于创建Vue实例
//import './componentsLoader.js'

开始渲染token菜单()
export {
    弹窗 as 弹窗,
    弹窗 as 对话框
}
export const 菜单控制器 = {
    渲染块标菜单
}


