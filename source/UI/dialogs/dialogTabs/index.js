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