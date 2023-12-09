import { plugin } from "./runtime.js";
import {logger} from "./runtime.js";
import * as 插件基础事件列表 from './eventTypeList.js'
export class EventEmitter {
    constructor() {
        this.插件基础事件列表=插件基础事件列表
    }
    on(event, callback) {
        if(!this.事件类型表[event]){
            console.error('未定义的事件类型')
            return 
        }
        if(typeof callback !== 'function'){
            console.error('callback 必须是一个函数');
            return;
        }
        plugin.eventBus.on(event,callback)
    }
    off(event, callback) {
        plugin.eventBus.on(event,callback)
    }
    once(event, callback) {
        if(!this.事件类型表[event]){
            console.error('未定义的事件类型')
            return 
        }
        if(typeof callback !== 'function'){
            console.error('callback 必须是一个函数');
            return;
        }
        const wrapper = (...args) => {
            callback(...args);
            this.off(event, wrapper);
        };
        this.on(event, wrapper);
    }
    emit(event, data) {
        logger.eventlog(this.listeners[event])
        if (!this.listeners[event]) {
            return;
        }
        this.listeners[event].forEach(callback => callback(
            {
                target:this,
                stack:(new Error()).stack,
                detail:data
            }
        ));
    }
}

