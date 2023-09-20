import { clientApi,plugin } from "../../asyncModules.js";
import {configProto} from '../../configProto.js'
export const 设置对话框 = async () => {
    console.log(plugin.configurer.list())
    let dialog = new clientApi.Dialog({
        title: "设置",
        content: `<div id="ai-chat-interface" class='fn__flex-column' style="pointer-events: auto;overflow:hidden"></div>`,
        destroyCallback: () => {
            
        },
        width: '600px',
        height: 'auto',
        transparent: true,
        disableClose: false,
        disableAnimation: false
    }, () => {
    });
    dialog.element.style.pointerEvents = 'none'
    dialog.element.style.zIndex = '1'
    dialog.element.querySelector(".b3-dialog__container").style.pointerEvents = 'auto'
    return dialog
};
export class 设置对话框控制器{
    constructor () {
     
    }
    async init(){
        await plugin.statusMonitor.set('settingDialogs','MAIN',this)
        this.inited = true
    }
    async show(){
        let settingForm =await 创建设置()
        let 对话框 = await 设置对话框()
        this.对话框实例 = 对话框
        this.isOpen = true
    }
    async hide(){
        if(this.对话框实例){
        this.对话框实例.destroy()
        this.对话框实例= undefined
        }
        this.isOpen=false

    }
}
export const 主设置对话框 = new 设置对话框控制器()
export const 创建设置=async()=>{
    检查结构是否一致(configProto,plugin.configurer.list())
    console.log(configProto)
}


function 检查结构是否一致(obj1, obj2, path = '') {
    for (let key in obj1) {
        if (!obj2.hasOwnProperty(key)) {
            console.warn(`属性 ${path}${key} 在第二个对象中不存在`);
        }
        if (typeof obj1[key] === 'object' && obj1[key] !== null) {
            if (!检查结构是否一致(obj1[key], obj2[key], path + key + '.')) {
            }
        }
    }
    // 检查 obj2 是否有 obj1 中不存在的属性
    for (let key in obj2) {
        if (!obj1.hasOwnProperty(key)) {
            console.log(`属性 ${path}${key} 在第一个对象中不存在`);
        }
    }
    return true;
}