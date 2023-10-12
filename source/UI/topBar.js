import { plugin } from "../asyncModules.js";
import { 主AI对话框 } from "./dialogs/chatDialogs.js";
import { 设置对话框 } from "./dialogs/settingsDialog.js";
import { 向量搜索窗口 } from "./dialogs/vactorSearchBlock.js";
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
topBarButton.addEventListener(
    'mousedown', async (event) => {
        // 检查是否是中键点击
        if (event.button === 1) {
            // 阻止默认的行为（例如，滚动）
            event.preventDefault();
            // 打开向量搜索对话框
            向量搜索窗口();
        }
    }
);