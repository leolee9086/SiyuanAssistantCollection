import { string2DOM } from "../builders/index.js";
import { plugin } from "../../asyncModules.js";
import {
    genLabel,
} from "./dialogTabs/index.js";
export const typeToInputter = (args,item) => {
    return {
        'string': () => createInputter(args, 'text', item, (value, element) => { element.value = value; }),
        'number': () => createInputter(args, 'number', item, (value, element) => { element.value = value; }),
        'boolean': () => createInputter(args, 'boolean', item, (value, element) => { element.checked = value; }),
        'singleSelect': () => createSelectInputter(args, item, false),
        'multiSelect': () => createSelectInputter(args, item, true),
    }
};
export function handleInputter(inputter, pathArray, tab, tabWrapper) {
    if (inputter) {
        let label = tabWrapper.querySelector(`[data-group="${pathArray[0] + '.' + pathArray[1]}"]`) || genLabel(pathArray, inputter);
        tab.appendChild(label);
    } 
}
export function createInputter(args, type, value, updateValue) {
    let element = createInputElement(type, value)
    element.addEventListener('change', () => {
        plugin.configurer.set(...args, type !== 'boolean' ? element.value : element.checked);
    });
    let settingChangeHandler = createSettingChangeHandler(args, element, updateValue);
    plugin.eventBus.on('settingChange', settingChangeHandler);
    return element;
}
function createSelectInputter(args, item, isMultiple) {
    let optionsHTML = item.options.map(option => 
        `<option value="${option.value||option}">${option.text||option.text||option}</option>`
    ).join('');
    let element = string2DOM(`
        <select  class="b3-select fn__flex-center fn__size200" ${isMultiple ? 'multiple' : ''}>
            ${optionsHTML}
        </select>
    `);
    element.value = item.$value;
    element.addEventListener('change', () => {
        plugin.configurer.set(...args, element.value);
    });
    let settingChangeHandler = createSettingChangeHandler(args, element, (value, element) => { element.value = value; });
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
        value="${value}">
        `
    )
    if (type === 'boolean') {
        el = string2DOM(
            `
            <input 
            class="b3-switch" 
            step="1" 
            min="0" 
            type="checkBox"
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