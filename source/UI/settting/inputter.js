import { string2DOM } from "../builders/index.js";
import { plugin } from "../../asyncModules.js";
export function createInputter(args, type, value, updateValue) {
    let element = string2DOM(`<input type="${type}" value="${value}">`);
    element.addEventListener('change', () => {
        plugin.configurer.set(...args,type==='boolean'? element.value:element.checked);
    });
    let settingChangeHandler = createSettingChangeHandler(args, element, updateValue);
    plugin.eventBus.on('settingChange', settingChangeHandler);
    return element;
}
function textArea(){
    return string2DOM(
        `
        <input 
        class="b3-text-field fn__flex-center fn__size200" 
        step="1" 
        min="0" 
        type="number" checked="" value="200">
        `
    )
}

function createSettingChangeHandler(args, element, updateValue) {
    return (event) => {
        if (event.detail.name === args.join('.')) {
            if (document.body.contains(element)) {
                updateValue(event.detail.value,element);
            } else {
                plugin.eventBus.off('settingChange', settingChangeHandler);
            }
        }
    };
}
