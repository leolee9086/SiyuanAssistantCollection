import { string2DOM } from "../builders/index.js";
import { plugin } from "../../asyncModules.js";
export function createInputter(args, type, value, updateValue) {
    let element = buildTextArea(type, value)
    element.addEventListener('change', () => {
        plugin.configurer.set(...args, type === 'boolean' ? element.value : element.checked);
    });
    let settingChangeHandler = createSettingChangeHandler(args, element, updateValue);
    plugin.eventBus.on('settingChange', settingChangeHandler);
    return element;
}
function buildTextArea(type, value) {
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
    if(type==='checkbox'){
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