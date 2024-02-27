import {sac,clientApi} from "../../../../asyncModules.js"
export const 显示模型选择菜单 = async (e) => {
    const res = await sac.路由管理器.internalFetch('/ai/v1/chat/listModels', { method: "POST" })
    const 模型列表 = res.body.data
    return new Promise(async(resolve) => { // 使用Promise包裹菜单逻辑
        const menu = new clientApi.Menu()
        for (let 模型名称 of Object.keys(模型列表)) {
            menu.addItem(
                {
                    icon: "",
                    label: `使用${模型名称}`,
                    click: () => {
                        resolve(模型名称) // 当用户点击时，解决Promise
                    }
                }
            )
        }
        menu.open({ x: e.clientX, y: e.clientY })
    });
}