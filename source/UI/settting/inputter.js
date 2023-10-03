import { string2DOM } from "../builders/index.js";
import { plugin } from "../../asyncModules.js";
import {
    createSideBarFragment,
    createTabWrapper,
    genLabel,
    handleTabDisplay
} from "./dialogTabs/index.js";
export function createSideBar(pathArray, sideBarFragment, tabWrapper) {
    let li = sideBarFragment.querySelector(`[data-name="${pathArray[0]}"]`);
    if (!li) {
        li = createSideBarFragment(pathArray);
        li.addEventListener('click', () => {
            Array.from(tabWrapper.children).forEach(tab => {
                tab.style.display = 'none';
            });
            let tab = tabWrapper.querySelector(`[data-name="${pathArray[0]}"]`);
            if (tab) {
                tab.style.display = 'block';
            }
        });
    }
    return li;
}

export function createTab(pathArray, tabWrapper) {
    return tabWrapper.querySelector(`[data-name="${pathArray[0]}"]`) || createTabWrapper(pathArray);
}

export function handleInputter(inputter, pathArray, tab, tabWrapper) {
    if (inputter) {
        let label = tabWrapper.querySelector(`[data-group="${pathArray[0] + '.' + pathArray[1]}"]`) || genLabel(pathArray, inputter);
        tab.appendChild(label);
    } else {
        let prop = plugin.configurer.get(...fullPath.split('.')).$value;
    }
}

export function buildSettingUI(settingList, base = '') {
    let keys = plugin.configurer.query(settingList, base);
    let frag = document.createDocumentFragment();
    let pathArray = keys[0].path.split('.');
    let sideBarFragment = string2DOM(`<ul class="b3-tab-bar b3-list b3-list--background"></ul>`);
    let tabWrapper = string2DOM(`<div class="config__tab-wrap"></div>`);
    for (let i = 0; i < keys.length; i++) {
        let item = keys[i];
        if (item.error) {
            continue;
        }
        let pathArray = base ? item.path.replace(base, '').split('.').filter(item => { return item !== '' }) : item.path.split('.');
        let fullPath = base ? `${base}.${pathArray.join('.')}` : pathArray.join('.');
        let li = createSideBar(pathArray, sideBarFragment, tabWrapper);
        let tab = createTab(pathArray, tabWrapper);
        sideBarFragment.appendChild(li);
        tabWrapper.appendChild(tab);
        let elementGenerator = 获取设置UI(...fullPath.split('.'));
        let inputter = elementGenerator();
        handleInputter(inputter, pathArray, tab, tabWrapper);
    }
    handleTabDisplay(tabWrapper);
    frag.appendChild(sideBarFragment);
    frag.appendChild(tabWrapper);
    return frag;
}



export function 获取设置UI(...args) {
    let UI生成函数 = plugin.statusMonitor.get('settingElements', ...args);
    if (!UI生成函数()) {
        let item = plugin.configurer.get(...args).$value;
        let elementGenerator;
        switch (typeof item) {
            case 'string':
                elementGenerator = () => createInputter(args, 'text', item, (value, element) => { element.value = value; });
                break;
            case 'number':
                elementGenerator = () => createInputter(args, 'number', item, (value, element) => { element.value = value; });
                break;
            case 'boolean':
                elementGenerator = () => createInputter(args, 'checkbox', item, (value, element) => { element.checked = value; });
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
export function createInputter(args, type, value, updateValue) {
    let element = createInputElement(type, value)
    element.addEventListener('change', () => {
        plugin.configurer.set(...args, type === 'boolean' ? element.value : element.checked);
    });
    let settingChangeHandler = createSettingChangeHandler(args, element, updateValue);
    plugin.eventBus.on('settingChange', settingChangeHandler);
    return element;
}
function createInputElement(type, value) {
    let el = string2DOM(
        `
        <input 
        class="b3-text-field fn__flex-center fn__size200" 
        step="1" 
        min="0" 
        type="${type}"
        checked="" 
        value="${value}">
        `
    )
    if (type === 'checkbox') {
        el = string2DOM(
            `
            <input 
            class="b3-switch" 
            step="1" 
            min="0" 
            type="${type}"
            ${value ? 'checked' : ''}
            >
            `
        )
    }
    return el
}

function createSettingChangeHandler(args, element, updateValue) {
    const settingChangeHandler = (event) => {
        if (event.detail.name === args.join('.')) {
            if (document.body.contains(element)) {
                updateValue(event.detail.value, element);
            } else {
                plugin.eventBus.off('settingChange', settingChangeHandler);
            }
        }
    };
    return settingChangeHandler;
}