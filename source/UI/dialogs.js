import { AI对话框控制器,主AI对话框控制器 } from './dialogs/chatDialogs.js'
import {设置对话框} from './dialogs/settingsDialog.js'
import { 向量搜索窗口 } from './dialogs/vactorSearchBlock.js'
import { 选择最近文档 } from './dialogs/recentBlocksDialog.js'
import './dialogs/rss.js'
let 主AI对话框 = new 主AI对话框控制器()
export {主AI对话框 as 主AI对话框}
//这里的clientApi只有在调用init之后再能使用
export {选择最近文档 as 选择最近文档}