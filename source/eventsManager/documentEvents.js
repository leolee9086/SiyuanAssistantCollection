import { pluginInstance as plugin } from "../asyncModules.js";
document.addEventListener(
    "keydown",
    async (e) => {
        if (e.code && (e.code === "ArrowUp" || e.code === "ArrowDown")) {
            return
        }
        plugin.tokenMenu && plugin.tokenMenu.menu ? plugin.tokenMenu.menu.remove() : null
        if (e.code === "Space" || e.code === "Enter") {
            // 触发菜单的 runAction 方法

            if (plugin.currentHintAction && plugin.currentHintAction.runAction) {
                e.preventDefault(); // 阻止原生事件的默认行为
                e.stopPropagation()
                e.stopImmediatePropagation()
                try {

                    plugin.tokenMenu && plugin.tokenMenu.menu && plugin.tokenMenu.menu.remove(); // 移除菜单
                    plugin.currentHintAction.runAction();

                } catch (e) {
                    console.warn(e)
                }
            }
        }
    },
    { capture: true }
);