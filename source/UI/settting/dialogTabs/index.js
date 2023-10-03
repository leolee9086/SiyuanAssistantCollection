import { string2DOM } from "../../builders/index.js";
import { plugin } from "../../../asyncModules.js";
import { 设置对话框 } from "../../dialogs/settingsDialog.js";
export function createSideBarFragment(pathArray) {
    let li = string2DOM(
        `<li data-name="${pathArray[0]}" class="b3-list-item">
            <svg class="b3-list-item__graphic">
                <use xlink:href="#iconKeymap"></use>
            </svg>
            <span class="b3-list-item__text">${pathArray[0]}</span>
        </li>`);
    return li;
}


export function createTab(pathArray, tabWrapper) {
    return tabWrapper.querySelector(`[data-name="${pathArray[0]}"]`) || createTabWrapper(pathArray);
}
export function createTabWrapper(pathArray) {
    let tab = string2DOM(
        `
        <div class="config__tab-container_SAC config__tab-container--top" data-name="${pathArray[0]}">
        </div>
        `);
    return tab;
}
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


export function handleTabDisplay(tabWrapper) {
    for (let i = 0; i < tabWrapper.children.length; i++) {
        if (i === 0) {
            tabWrapper.children[i].style.display = 'block';
        } else {
            tabWrapper.children[i].style.display = 'none';
        }
    }
}
export function genLabel(pathArray, inputter) {
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
