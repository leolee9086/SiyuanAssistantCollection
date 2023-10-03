import { string2DOM } from "../../builders/index.js";
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
export function createTabWrapper(pathArray) {
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
