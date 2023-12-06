import { plugin } from "../../asyncModules.js";
export function 计算cpu核心数量(){
    let cpu核心数 = navigator.hardwareConcurrency/2 || 4;
    cpu核心数 = plugin.configurer.get('向量工具设置','索引占用核心').$value||cpu核心数
    plugin.configurer.set('向量工具设置','索引占用核心',cpu核心数)
    return cpu核心数
}