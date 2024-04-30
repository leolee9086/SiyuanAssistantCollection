import { plugin,clientApi } from "../asyncModules.js";
import { 主AI对话框 } from "./dialogs/chatDialogs.js";
import { 设置对话框 } from "./dialogs/settingsDialog.js";
import { 向量搜索窗口 } from "./dialogs/vactorSearchBlock.js";
import { AI对话框控制器 } from "./dialogs/chatDialogs.js";
import roster from '../throne/ghostDomain/index.js'
await 主AI对话框.init()
let topBarButton = plugin.statusMonitor.get('UI', 'topBarButton').$value
topBarButton.addEventListener(
    'click', async () => {
        let 主AI对话框 = await plugin.statusMonitor.get('aiDialogs', 'MAIN').$value
        if (主AI对话框.isOpen) {
            const menu = new clientApi.Menu()
            const ghosts =await roster.listGhostNames()
            let rect = topBarButton.getClientRects()[0]
            ghosts.forEach(
                ghost=>{
                    menu.addItem({
                        label:ghost,
                        click:async()=>{
                            let 控制器= new AI对话框控制器(ghost)
                            await 控制器.init()
                            控制器.show()
                        }
                    })
                }
            )
        
            menu.open({
                x: rect.right - 25 - 76,
                y: rect.bottom,
                isLeft: false,
            });
        
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