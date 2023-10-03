import { clientApi, plugin } from "../../asyncModules.js";
import { buildSettingUI } from "../settting/index.js";
export const 设置对话框 = async (settingList, base) => {
    // 获取 settingList 的所有键
    if(!settingList||settingList=={}){
        settingList = plugin.configurer.list()
    }
    let keys = plugin.configurer.query(settingList, base)
    // 如果 settingList 有至少一个键，使用第一个键作为标题
    // 否则，使用 "SAC配置" 作为默认标题
    let title = keys.length == 1 ? `SAC配置-${keys[0]}` : 'SAC配置';
    let dialog = new clientApi.Dialog({
        title: title,
        content: `<div id="ai-setting-interface" class='fn__flex-1 fn__flex config__panel_SAC' style="pointer-events: auto;overflow:hidden;position: relative"></div>`,
        destroyCallback: () => {

        },
        width: '60vw',
        height: 'auto',
        transparent: true,
        disableClose: false,
        disableAnimation: false
    }, () => {

    });
    dialog.element.style.pointerEvents = 'none'
    dialog.element.style.zIndex = '1'
    dialog.element.querySelector(".b3-dialog__container").style.pointerEvents = 'auto'
    dialog.element.querySelector(".config__panel_SAC").appendChild(buildSettingUI(settingList, base))
    return dialog
};




