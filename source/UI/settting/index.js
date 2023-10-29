import {
    handleTabDisplay,
    createTab,
    createSideBar
} from "./dialogTabs/index.js";
import { typeToInputter, handleInputter } from "./inputter.js";
import { plugin } from "../../asyncModules.js";
import { string2DOM } from "../builders/index.js";
export function buildSettingUI(settingList, base = '') {
    let keys = plugin.configurer.query(settingList, base);
    let frag = document.createDocumentFragment();
    let tabWrapper = string2DOM(`<div class="config__tab-wrap"></div>`);
    let isSingleLevel = keys.every((item, i, arr) => {
        if (i === 0) return true;
        let prevPathParts = arr[i - 1].path.split('.');
        let currPathParts = item.path.split('.');
        return prevPathParts.slice(0, -1).join('.') === currPathParts.slice(0, -1).join('.');
    });
    let sideBarFragment;
    if (!isSingleLevel) {
        sideBarFragment = string2DOM(`<ul class="b3-tab-bar b3-list b3-list--background"></ul>`);
    }
    let firstTab;
    for (let i = 0; i < keys.length; i++) {
        let item = keys[i];
        if (item.error) {
            continue;
        }
        let pathArray = base ? item.path.replace(base, '').split('.').filter(item => { return item !== '' }) : item.path.split('.');
        let fullPath = base ? `${base}.${pathArray.join('.')}` : pathArray.join('.');
        let li, tab;
        if (!isSingleLevel) {
            li = createSideBar(pathArray, sideBarFragment, tabWrapper);
            sideBarFragment.appendChild(li);
        }
        tab = createTab(pathArray, tabWrapper);
      
        tabWrapper.appendChild(tab);
        let elementGenerator = 获取设置UI(...fullPath.split('.'));
        let inputter = elementGenerator();
        handleInputter(inputter, pathArray, tab, tabWrapper);
        if (i === 0) {
            firstTab = tab;
        } else if (isSingleLevel) {
           console.log(tab,tab.querySelector('.config__item'))
            while (tab.querySelector('.config__item')&&firstTab!==tab) {
               firstTab.appendChild(tab.querySelector('.config__item'));
            }
        }

    }
    if (!isSingleLevel) {
        handleTabDisplay(tabWrapper);
        frag.appendChild(sideBarFragment);
    }
    frag.appendChild(tabWrapper);
    return frag;
}

export function 获取设置UI(...args) {
    let UI生成函数 = plugin.statusMonitor.get('settingElements', ...args);
    if (!UI生成函数()) {
        let item = plugin.configurer.get(...args).$raw;
        let itemType = item && item.$type ? item.$type : typeof item;
        let elementGenerator;
        elementGenerator = typeToInputter(args,item)[itemType] || (() => {
            let element = document.createElement('input');
            element.type = 'text';
            element.value = '属性不合法或不存在';
            element.disabled = true;
            return element;
        });

        return elementGenerator;
    } else {
        return UI生成函数;
    }
}
