import { pluginInstance as plugin, clientApi } from '../source/asyncModules.js';
import kernelApi from '../source/polyfills/kernelApi.js';
import { FormItem, FormInputter } from './FormItem.js';
const STORAGE_NAME = 'STORAGE_NAME';
const settingsArray = [
    {
        name: 'readonlyText',
        label: 'Readonly text',
        placeholder: 'Readonly text in the menu',
        type: 'textarea',
        value: 'Default text'

    },
    {
        name: 'booleanOption',
        label: 'Boolean option',
        placeholder: 'Check this option',
        type: 'checkbox',
        value: false
    }
];
createSettings(settingsArray, plugin, STORAGE_NAME);
export class settingItem {
    constructor(options) {
        this.options = options
    }
    get value() {
        return this, _value
    }
    set value(newValue) {
        if (this._value !== newValue) {
            this._value = newValue
            if (!plugin.data.setting) {
                plugin.data.setting = {}
            }
            plugin.data.setting[this.name] = this.value
            plugin.eventBus.emit(`settingChange`, {name:this.name,value:this.value})
        }
    }
}

function createSettings(settingsArray, plugin, STORAGE_NAME) {
    plugin.setting = new clientApi.Setting({
        confirmCallback: () => {
            const data = settingsArray.reduce((acc, curr) => {
                acc[curr.key] = curr.formItem.inputter.value;
                return acc;
            }, {});
            plugin.saveData(STORAGE_NAME, data);
        }
    });
    settingsArray.forEach(settingItem => {
        const formInputter = new FormInputter(settingItem, () => { }, () => { });
        plugin.setting.addItem({
            title: settingItem.name,
            createActionElement: () => formInputter.element,
        });
    });
    console.log(plugin.setting)
    return plugin.setting;
}

export function addSetting() {

}