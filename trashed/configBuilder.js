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

const 创建悬浮球 = () => {
    // 创建一个新的div元素，这将是我们的悬浮球
    let 悬浮球 = document.createElement('div');

    // 设置悬浮球的样式
    悬浮球.style.position = 'fixed';  // 固定位置
    悬浮球.style.bottom = '20px';     // 距离底部20px
    悬浮球.style.right = '20px';      // 距离右边20px
    悬浮球.style.width = '50px';      // 宽度50px
    悬浮球.style.height = '50px';     // 高度50px
    悬浮球.style.borderRadius = '50%'; // 边框半径50%，使其成为一个圆形
    悬浮球.style.backgroundColor = 'red'; // 背景色红色

    // 将悬浮球添加到页面中
    document.body.appendChild(悬浮球);
    return 悬浮球
};