import { string2DOM } from "./settingTypeDefine"


export const number = () => {
    let element = string2DOM(
        `
        <input 
        class="b3-text-field fn__flex-center fn__size200" 
        id="historyRetentionDays" 
        type="number" 
        min="0" 
        value="30">
        `
    );

    return {
        get value() {
            return element.value;
        },
        set value(val) {
            element.value = val;
        },
        element:element
    };
}
export const number_slider = () => {
    let element = string2DOM(
        `
        <input 
        class="b3-slider fn__size200" 
        max="8" 
        min="0" 
        step="2" 
        type="range" 
        value="4">        `
    );
    return {
        get value() {
            return element.value;
        },
        set value(val) {
            element.value = val;
        },
        element:element
    };
}