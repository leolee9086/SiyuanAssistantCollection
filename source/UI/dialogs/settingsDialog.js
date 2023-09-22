import { clientApi, plugin } from "../../asyncModules.js";
import kernelApi from '../../polyfills/kernelApi.js'
let settingList = {
    日志设置: [
        'aiChat',
        'aiShell'
    ],
    '向量工具设置': { 默认文本向量化模型: "" },
    聊天工具设置: {
        模型设置: ''
    }
}
export const 设置对话框 = async (settingList, base) => {
    // 获取 settingList 的所有键

    let keys = plugin.configurer.query(settingList, base)
    console.log(settingList, keys)
    // 如果 settingList 有至少一个键，使用第一个键作为标题
    // 否则，使用 "SAC配置" 作为默认标题
    let title = keys.length == 1 ? `SAC配置-${keys[0]}` : 'SAC配置';
    let dialog = new clientApi.Dialog({
        title: title,
        content: `<div id="ai-setting-interface" class='fn__flex-1 fn__flex config__panel_SAC' style="pointer-events: auto;overflow:hidden;position: relative"></div>`,
        destroyCallback: () => {

        },
        width: '600px',
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
设置对话框(settingList)
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
        console.log(pathArray, fullPath)
        let li = sideBarFragment.querySelector(`[data-name="${pathArray[0]}"]`);
        if (!li) {
            li = string2DOM(
                `<li data-name="${pathArray[0]}" class="b3-list-item">
                    <svg class="b3-list-item__graphic">
                        <use xlink:href="#iconKeymap"></use>
                    </svg>
                    <span class="b3-list-item__text">${pathArray[0]}</span>
                </li>`);
            li.addEventListener('click', () => {
                Array.from(tabWrapper.children).forEach(tab => {
                    tab.style.display = 'none';
                });
                tab.style.display = 'block';
            });
        }
        let tab = tabWrapper.querySelector(`[data-name="${pathArray[0]}"]`) || string2DOM(
            `
            <div class="config__tab-container_SAC config__tab-container--top" data-name="${pathArray[0]}">
            </div>
            `);

        sideBarFragment.appendChild(li);
        tabWrapper.appendChild(tab);
        console.log(keys, settingList);
        let elementGenerator = 获取设置UI(...fullPath.split('.'));
        console.log(fullPath, elementGenerator);

        let inputter = elementGenerator();
        //如果有,就直接构建配置器就可以
        if (inputter) {
            let label = tabWrapper.querySelector(`[data-group="${pathArray[0] + '.' + pathArray[1]}"]`) || genLabel(pathArray, inputter);
            tab.appendChild(label);
        } else {
            let prop = plugin.configurer.get(...fullPath.split('.')).$value;
            console.log(prop);
        }
    }
    for (let i = 0; i < tabWrapper.children.length; i++) {
        if (i === 0) {
            tabWrapper.children[i].style.display = 'block';
        } else {
            tabWrapper.children[i].style.display = 'none';
        }
    }
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
        console.log(pathArray)
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

function string2DOM(string) {
    string = string.trim()
    let div = document.createElement('div');
    div.innerHTML = string;

    // 如果 div 只有一个子元素，直接返回这个子元素
    if (div.childNodes.length === 1) {
        return div.firstChild;
    }

    // 否则，返回包含所有子元素的文档片段
    let fragment = document.createDocumentFragment();
    while (div.firstChild) {
        fragment.appendChild(div.firstChild);
    }

    return fragment;
}

function 修改设置UI(...args) {
    if (typeof args[args.length - 1] !== Function) {
        throw new Error('必须提供一个返回元素的函数')
    }
    plugin.statusMonitor.set('settingElements', ...args)
}
function 获取设置UI(...args) {
    let UI生成函数 = plugin.statusMonitor.get('settingElements', ...args)
    console.log(UI生成函数)
    if (!UI生成函数()) {
        let item = plugin.configurer.get(...args).$value
        let element
        let elementGenerator
        switch (typeof item) {
            case 'string':
                elementGenerator = () => {
                    element = document.createElement('input');
                    element.type = 'text';
                    element.value = item;
                    element.addEventListener('change', () => {
                        plugin.configurer.set(...args, element.value)
                    })
                    let settingChangeHandler = (event) => {
                        if (event.detail.name === args.join('.')) {
                            if (document.body.contains(element)) {
                                element.value = event.detail.value;
                            } else {
                                plugin.eventBus.off('settingChange', settingChangeHandler);
                            }
                        }
                    };
                    plugin.eventBus.on('settingChange', settingChangeHandler);

                    return element;
                };

                break;
            case 'number':
                elementGenerator = () => {
                    element = document.createElement('input');
                    element.type = 'number';
                    element.value = item;
                    element.addEventListener('change', () => {
                        plugin.configurer.set(...args, element.value)
                    })
                    let settingChangeHandler = (event) => {
                        if (event.detail.name === args.join('.')) {
                            if (document.body.contains(element)) {
                                element.value = event.detail.value;
                            } else {
                                plugin.eventBus.off('settingChange', settingChangeHandler);
                            }
                        }
                    };
                    plugin.eventBus.on('settingChange', settingChangeHandler);

                    return element;
                };
                break;
            case 'boolean':
                elementGenerator = () => {
                    element = document.createElement('input');
                    element.type = 'checkbox';
                    element.checked = item;
                    element.addEventListener('change', () => {
                        plugin.configurer.set(...args, element.checked)
                    })
                    let settingChangeHandler = (event) => {
                        if (event.detail.name === args.join('.')) {
                            if (document.body.contains(element)) {
                                element.checked = event.detail.value;
                            } else {
                                plugin.eventBus.off('settingChange', settingChangeHandler);
                            }
                        }
                    };
                    plugin.eventBus.on('settingChange', settingChangeHandler);

                    return element;
                };
                break;
            default:
                elementGenerator = () => {
                    element = document.createElement('input');
                    element.type = 'text';
                    element.value = '属性不合法或不存在';
                    element.disabled = true;
                    return element;
                };
                break;

        }

        return elementGenerator
    } else {
        return UI生成函数
    }
}
