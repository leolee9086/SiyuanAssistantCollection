import { plugin } from "../asyncModules.js";
import { 主AI对话框 } from "./dialogs/chatDialogs.js";
import { 设置对话框 } from "./dialogs/settingsDialog.js";
await 主AI对话框.init()
let topBarButton = plugin.statusMonitor.get('UI', 'topBarButton').$value
topBarButton.addEventListener(
    'click', async () => {
        let 主AI对话框 = await plugin.statusMonitor.get('aiDialogs', 'MAIN').$value
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
        设置对话框()
    }
)
