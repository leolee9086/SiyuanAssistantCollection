import { plugin } from "../asyncModules.js";
import { 主AI对话框 } from "./dialogs/chatDialogs.js";
import {主设置对话框} from "./dialogs/settings.js"
await 主AI对话框.init()
await 主设置对话框.init()
let topBarButton = plugin.statusMonitor.get('UI', 'topBarButton')
topBarButton.addEventListener(
    'click', async () => {
        let 主AI对话框 = await plugin.statusMonitor.get('aiDialogs', 'MAIN')
        console.log(主AI对话框)
        if (主AI对话框.isOpen) {
            await 主AI对话框.hide()
        }
        else {
            await 主AI对话框.show()
        }
    }
)
topBarButton.addEventListener(
    'contextmenu', async () => {
        let 主设置对话框 = await plugin.statusMonitor.get('settingDialogs', 'MAIN')
        if (主设置对话框.isOpen) {
            await 主设置对话框.hide()
        }
        else {
            await 主设置对话框.show()
        }
    }
)