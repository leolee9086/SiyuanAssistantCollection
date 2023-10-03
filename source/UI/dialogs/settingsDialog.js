import { clientApi, plugin } from "../../asyncModules.js";
import kernelApi from '../../polyfills/kernelApi.js'
import { string2DOM } from "../builders/index.js";
import { createInputter } from "../settting/inputter.js";
import { createSideBarFragment } from "./dialogTabs/index.js";
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
function createTabWrapper(pathArray) {
    let tab = string2DOM(
        `
        <div class="config__tab-container_SAC config__tab-container--top" data-name="${pathArray[0]}">
        </div>
        `);
    return tab;
}
function handleTabDisplay(tabWrapper) {
    for (let i = 0; i < tabWrapper.children.length; i++) {
        if (i === 0) {
            tabWrapper.children[i].style.display = 'block';
        } else {
            tabWrapper.children[i].style.display = 'none';
        }
    }
}
function buildSettingUI(settingList, base = '') {
    let keys = plugin.configurer.query(settingList, base);
    let frag = document.createDocumentFragment();
    let pathArray = keys[0].path.split('.');
    //首先允许构建侧脸列表
    let sideBarFragment = string2DOM(
        `<ul class="b3-tab-bar b3-list b3-list--background">
        </ul>`);
    let tabWrapper = string2DOM(
        `<div class="config__tab-wrap">
       </div>`);
    for (let i = 0; i < keys.length; i++) {
        let item = keys[i];
        if (item.error) {
            continue;
        }
        let pathArray = base ? item.path.replace(base, '').split('.').filter(item => { return item !== '' }) : item.path.split('.');
        let fullPath = base ? `${base}.${pathArray.join('.')}` : pathArray.join('.');
        let li = sideBarFragment.querySelector(`[data-name="${pathArray[0]}"]`);
        if (!li) {
            li = createSideBarFragment(pathArray);
            li.addEventListener('click', () => {
                Array.from(tabWrapper.children).forEach(tab => {
                    tab.style.display = 'none';
                });
                tab.style.display = 'block';
            });
        }
        let tab = tabWrapper.querySelector(`[data-name="${pathArray[0]}"]`) || createTabWrapper(pathArray);

        sideBarFragment.appendChild(li);
        tabWrapper.appendChild(tab);
        let elementGenerator = 获取设置UI(...fullPath.split('.'));
        let inputter = elementGenerator();
        //如果有,就直接构建配置器就可以
        if (inputter) {
            let label = tabWrapper.querySelector(`[data-group="${pathArray[0] + '.' + pathArray[1]}"]`) || genLabel(pathArray, inputter);
            tab.appendChild(label);
        } else {
            let prop = plugin.configurer.get(...fullPath.split('.')).$value;
        }
    }
    handleTabDisplay(tabWrapper);
    frag.appendChild(sideBarFragment);
    frag.appendChild(tabWrapper);
    return frag;
}
function genLabel(pathArray, inputter) {
    if (pathArray.length <= 2) {
        let labelFragment = string2DOM(`
        <label class="fn__flex b3-label config__item">
            <div class="fn__flex-center fn__flex-1 ft__on-surface">
                ${pathArray[pathArray.length - 1]}
            </div>
            <span class="fn__space"></span>
        </label>`
        )
        labelFragment.appendChild(inputter)
        return labelFragment
    } else {
        let labelFragment = string2DOM(`
            <label class="fn__flex b3-label config__item" data-group="${pathArray[0] + '.' + pathArray[1]}">
                <span class="fn__flex-center"> ${pathArray[1]}</span>
                <span class="fn__flex-1"></span>
                <span class="fn__space"></span>
                <button  class="b3-button b3-button--outline fn__flex-center fn__size200">
                    <svg><use xlink:href="#iconSettings"></use></svg>
                    打开设置
                </button>
            </label>`
        )
        labelFragment.querySelector('button').addEventListener(
            'click', () => {
                let newSettingList = plugin.configurer.get(...pathArray.slice(0, 2)).$value;
                let { [pathArray[pathArray.length - 1]]: _, ...newSettingListWithoutEndValue } = newSettingList;
                设置对话框(newSettingListWithoutEndValue, pathArray.slice(0, 2).join('.'));
            }
        )
        return labelFragment
    }
}


function 获取设置UI(...args) {
    let UI生成函数 = plugin.statusMonitor.get('settingElements', ...args);
    if (!UI生成函数()) {
        let item = plugin.configurer.get(...args).$value;
        let elementGenerator;
        switch (typeof item) {
            case 'string':
                elementGenerator = () => createInputter(args, 'text', item, (value,element) => { element.value = value; });
                break;
            case 'number':
                elementGenerator = () => createInputter(args, 'number', item, (value,element) => { element.value = value; });
                break;
            case 'boolean':
                elementGenerator = () => createInputter(args, 'checkbox', item, (value,element) => { element.checked = value; });
                break;
            default:
                elementGenerator = () => {
                    let element = document.createElement('input');
                    element.type = 'text';
                    element.value = '属性不合法或不存在';
                    element.disabled = true;
                    return element;
                };
                break;
        }
        return elementGenerator;
    } else {
        return UI生成函数;
    }
}
