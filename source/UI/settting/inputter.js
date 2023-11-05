import { string2DOM } from "../builders/index.js";
import { plugin } from "../../asyncModules.js";
import {
    genLabel,
} from "./dialogTabs/index.js";
import { logger } from "../../logger/index.js";
export const typeToInputter = (args, item) => {
    return {
        'string': () => createInputter(args, 'text', item, (value, element) => { element.value = value.$value ? value.$value : value }),
        'number': () => createInputter(args, 'number', item, (value, element) => { element.value = value.$value ? value.$value : value }),
        'range': () => createInputter(args, 'range', item, (value, element) => { element.value = value.$value ? value.$value : value }),

        'boolean': () => createInputter(args, 'boolean', item, (value, element) => { element.checked = value.$value ? value.$value : value; }),
        'singleSelect': () => createSelectInputter(args, item, false),
        'multiSelect': () => createSelectInputter(args, item, true),
        'button': () => createButton(args, item) 
    }
};

export function handleInputter(inputter, pathArray, tab, tabWrapper, fullPath) {
    if (inputter) {
        let label = tabWrapper.querySelector(`[data-group="${pathArray[0] + '.' + pathArray[1]}"]`) || genLabel(pathArray, inputter, fullPath);
        tab.appendChild(label);
    }
}
export function createInputter(args, type, value, updateValue) {
    let element = createInputElement(type, value)
    element.addEventListener('change', () => {
        if(type==='number'||type==='range'){
            element.value = Number(element.value)?Number(element.value):0
        }
        plugin.configurer.set(...args, type !== 'boolean' ? Number(element.value)?Number(element.value):(element.value||0) : element.checked);
    });
    let settingChangeHandler = createSettingChangeHandler(args, element, updateValue);
    plugin.eventBus.on('settingChange', settingChangeHandler);
    return element;
}
function createButton(args, item) {
    let element = string2DOM(`
    <button class="b3-button b3-button--outline fn__flex-center fn__size200">
                    ${item.$value || args[args.length - 1]}
                </button>
`);
    element.addEventListener('click', () => {
        plugin.eventBus.emit('settingButtonClicked', args);
        if(item.$emit){
            plugin.eventBus.emit(item.$emit, args);
        }
    });
    logger.settinglog(element)
    return element
}
function createSelectInputter(args, item, isMultiple) {
    let optionsHTML = item.options.map(option =>
        `<option value="${option.value || option}">${option.text || option.text || option}</option>`
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
    let settingChangeHandler = createSettingChangeHandler(args, element, (value, element) => { element.value = value.$value ? value.$value : value; });
    plugin.eventBus.on('settingChange', settingChangeHandler);
    return element;
}
function createInputElement(type, value) {
    let el = string2DOM(
        `
        <input 
        class="${type!=='range'?"b3-text-field":''} fn__flex-center fn__size200" 
        step="${value.$step||1}" 
        min="${value.$min||0}" 
        max="${value.$max||102400}" 

        type="${type}"
        value="${value.$value===undefined?value:value.$value}">
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