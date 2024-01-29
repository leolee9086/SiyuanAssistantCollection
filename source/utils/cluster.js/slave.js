import { sacClusterChannel_heartbeat } from "./channels";
import { 成为主实例 } from "./index.js";

let lastHeartbeatTime = null;
const HEARTBEAT_TIMEOUT = 5000; // 如果5秒内没有收到心跳，认为主实例失联

function 开始监听主实例心跳(){
    sacClusterChannel_heartbeat.onmessage = (event) => {
        if (event.data === 'heartbeat') {
            刷新主实例心跳时间();
        }
    };

    // 每秒检查一次主实例是否失联
    setInterval(() => {
        if (Date.now() - lastHeartbeatTime > HEARTBEAT_TIMEOUT) {
            // 如果主实例失联，开始尝试竞选主实例
            成为主实例();
        }
    }, 1000);
}

function 刷新主实例心跳时间(){
    lastHeartbeatTime = Date.now();
}