import { clientApi, plugin } from "../../asyncModules.js";
import { buildSettingUI } from "../settting/index.js";
import { logger } from "../../logger/index.js";
import { 计算zindex } from "./util/zIndex.js";
export const 设置对话框 = async (settingList, base) => {
    // 获取 settingList 的所有键
    logger.settinglog(settingList, base)
    if (!settingList || settingList == {}) {
        settingList = plugin.configurer.list()
    }
    let keys = plugin.configurer.query(settingList, base)
    // 如果 settingList 有至少一个键，使用第一个键作为标题
    // 否则，使用 "SAC配置" 作为默认标题
    let title;
    if (keys.length > 0) {
        let paths = keys.map(key => key.path.split('.'));
        let minPathLength = Math.min(...paths.map(path => path.length));
        for (let i = 0; i < minPathLength; i++) {
            let part = paths[0][i];
            if (paths.some(path => path[i] !== part)) {
                break;
            }
            title = (title ? title + '.' : '') + part;
        }
    }
    title = title ? `SAC配置-${title}` : 'SAC配置';
    let dialog = new clientApi.Dialog({
        title: title,
        content: `<div id="ai-setting-interface" class='fn__flex-1 fn__flex config__panel_SAC' style="pointer-events: auto;overflow:hidden;position: relative"></div>`,
        destroyCallback: () => {
            plugin.eventBus.off('sac-rebuild-dialogs-setting',
                dialog.rebuild
            )
        },
        width: '60vw',
        height: '50vh',
        transparent: true,
        disableClose: false,
        disableAnimation: false
    }, () => {

    });
    dialog.element.style.pointerEvents = 'none'
    dialog.element.style.zIndex = 计算zindex('.layout__resize--lr.layout__resize')
    dialog.element.querySelector(".b3-dialog__container").style.pointerEvents = 'auto'
    dialog.element.querySelector(".config__panel_SAC").appendChild(buildSettingUI(settingList, base))
    dialog.rebuild = () => { 
        dialog.element.querySelector(".config__panel_SAC").innerHTML=''
        dialog.element.querySelector(".config__panel_SAC").appendChild(buildSettingUI(settingList, base)) 
    }
    plugin.eventBus.on('sac-rebuild-dialogs-setting',
        dialog.rebuild
    )
    dialog.type = 'sacSetting'
    return dialog
};




