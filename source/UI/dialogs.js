import { AI对话框控制器,主AI对话框控制器 } from './dialogs/chatDialogs.js'
import {设置对话框} from './dialogs/settingsDialog.js'
let 主AI对话框 = new 主AI对话框控制器()
export {主AI对话框 as 主AI对话框}
//这里的clientApi只有在调用init之后再能使用
