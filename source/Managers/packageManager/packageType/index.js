import sac from '../runtime.js'
export function 设置包加载器(包类型,读取函数){
    if(!sac.statusMonitor.get(包类型).$value){
        throw '包类型不存在'
    }
}
export function 增加包类型(类型名,安装位置){
    if(typeof 类型名 !== 'string'){
        throw new Error('类型名必须是字符串');
    }
    if(typeof 类型名 !== 'string'){
        throw new Error('安装位置必须是字符串')
    }
}
export function 设置包下载器(包类型,下载函数){
    if(!sac.statusMonitor.get(包类型).$value){
        throw '包类型不存在'
    }
}
