import { plugin } from "./runtime.js";
import * as 插件基础事件列表 from './SiyuanBaseEventTypeList.js'
export class EventEmitter {
    constructor(channel, 事件类型表) {
        if (!事件类型表) {
            throw '事件监听器必须声明事件类型表'
        }
        this.事件类型表 = 事件类型表
        this.channel = channel
        if (!this.channel) {
            throw '事件监听器必须提供channel'
        }
        this.插件基础事件列表 = 插件基础事件列表
        plugin.statusMonitor.set('eventEmitters',this.channel,this)
        this.listeners={}
    }
    genEventName(事件名称) {
        return this.channel + '-' + 事件名称
    }
    getEventName(原始名称) {
        for (let key in this.事件类型表) {
            if (key === 原始名称 || this.事件类型表[key] === 原始名称) {
                return this.事件类型表[key];
            }
        }
        return null;  // 如果没有找到匹配的项，返回null
    }
    on(event, callback) {
        if (!this.getEventName(event)) {
            throw '未定义的事件类型:' + event
        }
        if (typeof callback !== 'function') {
            console.error('callback 必须是一个函数');
            return;
        }
        console.log(this.getEventName(event))
        //将事件传递给eventBus
        this.listeners[event]=this.listeners[event]||[]
        this.listeners[event].push(callback)
        plugin.eventBus.on(this.genEventName(this.getEventName(event)), callback)
    }
    off(event, callback) {
        //将事件传递给eventBus
        plugin.eventBus.off(this.genEventName(event), callback)
    }
    once(event, callback) {
        if (!this.getEventName(event)) {
            console.error('未定义的事件类型')
            return
        }
        if (typeof callback !== 'function') {
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
        console.log(this.listeners,event)
        if (!this.listeners[event]) {
            return;
        }
        this.listeners[event].forEach(callback => callback(
            {
                target: this,
                stack: (new Error()).stack,
                detail: data
            }
        ));
        plugin.eventBus.emit(this.genEventName(event), data)
    }
}
plugin.EventEmitter = EventEmitter
