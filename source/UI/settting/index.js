import {
    handleTabDisplay,
    createTab,
    createSideBar
} from "./dialogTabs/index.js";
import { typeToInputter, handleInputter } from "./inputter.js";
import { plugin } from "../../asyncModules.js";
import { string2DOM } from "../builders/index.js";
import './describe.js'

function createPathArray(item, base) {
    return base ? item.path.replace(base, '').split('.').filter(item => { return item !== '' }) : item.path.split('.');
}

function createFullPath(pathArray, base) {
    return base ? `${base}.${pathArray.join('.')}` : pathArray.join('.');
}

function handleFirstTab(i, tab, firstTab) {
    if (i === 0) {
        return tab;
    } else {
        while (tab.querySelector('.config__item') && firstTab !== tab) {
            firstTab.appendChild(tab.querySelector('.config__item'));
        }
        return firstTab;
    }
}

function processKey(item, base, tabWrapper) {
    let pathArray = createPathArray(item, base);
    let fullPath = createFullPath(pathArray, base);
    let tab = createTab(pathArray, tabWrapper);
    tabWrapper.appendChild(tab);
    let elementGenerator = 获取设置UI(...fullPath.split('.'));
    let inputter = elementGenerator();
    handleInputter(inputter, pathArray, tab, tabWrapper,fullPath);
    return tab
}

function createSingleLevel(keys, base, tabWrapper, firstTab) {
    for (let i = 0; i < keys.length; i++) {
        let item = keys[i];
        if (item.error) {
            continue;
        }
        let tab= processKey(item, base, tabWrapper)
        firstTab = handleFirstTab(i, tab, firstTab);
    }
}

function createMultiLevel(keys, base, tabWrapper, sideBarFragment) {
    for (let i = 0; i < keys.length; i++) {
        let item = keys[i];
        if (item.error) {
            continue;
        }
        let pathArray = createPathArray(item, base);
        processKey(item, base, tabWrapper)
        let li = createSideBar(pathArray, sideBarFragment, tabWrapper);
        sideBarFragment.appendChild(li);
    }
}

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
    let firstTab;
    if (!isSingleLevel) {
        sideBarFragment = string2DOM(`<ul class="b3-tab-bar b3-list b3-list--background"></ul>`);
        createMultiLevel(keys, base, tabWrapper, sideBarFragment);
        handleTabDisplay(tabWrapper);
        frag.appendChild(sideBarFragment);
    } else {
        createSingleLevel(keys, base, tabWrapper, firstTab);
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
