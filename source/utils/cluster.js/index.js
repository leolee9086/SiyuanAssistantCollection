import { sac } from "../../asyncModules.js"
import { sacClusterChannel_heartbeat } from "./channels.js";
function 判定是否本地主实例空缺() {
    return sessionStorage.getItem('hasMaster') === null;
}
function 设置本地主实例锁() {
    sessionStorage.setItem('hasMaster', 'true');
}
function 成为主实例() {
    if (!判定是否本地主实例空缺()) {
        return
    }
    sac.statusMonitor.set('cluster', 'localRole', 'master', true)
    设置本地主实例锁()
}
function 已经成为主实例() {
    return sac.statusMonitor.get('cluster', 'localRole').$value === 'master'
}
function 释放本地主实例锁() {
    if (已经成为主实例) {
        sessionStorage.removeItem('hasMaster');
        sac.statusMonitor.set('cluster', 'localRole', 'slave', true);
    } else {
        throw "不是本地主实例,没有权限释放本地主实例锁"
    }
}
function 开始发送心跳(){
    setInterval(
        ()=>{
            if(!已经成为主实例){return}
            sacClusterChannel_heartbeat.postMessage('heartbeat')
        },1000
    )
}