import { plugin } from "./runtime.js";
import {logger} from "./runtime.js";

class EventBusDummy {
    constructor() {
        this.listeners = {};
    }
    on(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        } else if (this.listeners[event].includes(callback)) {
            logger.eventWarn(`Warning: The callback has already been added to the event "${event}".`,callback,this);
            return;
        }
        this.listeners[event].push(callback);
    }
    off(event, callback) {
        if (!this.listeners[event]) {
            return;
        }
        const index = this.listeners[event].indexOf(callback);
        if (index > -1) {
            this.listeners[event].splice(index, 1);
        }
    }
    once(event, callback) {
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
let eventBus
if(plugin){
    eventBus=plugin.eventBus
}else{
    eventBus=new EventBusDummy()
}

export class EventEmitter extends EventBusDummy{
    constructor(chanel) {
        super()
        this.eventRegistry = new Map();  // 事件注册表
        this.chanel = chanel
    }
    subscribe(event, listener) {
        if (!this.chanel) {
            logger.warn('声明事件监听的类必须有chanel属性')
        }
        const eventName = this.chanel + '_' + event;
        eventBus.on(eventName, listener)
        // 添加事件到注册表
        if (!this.eventRegistry.has(eventName)) {
            this.eventRegistry.set(eventName, []);
        }
        this.eventRegistry.get(eventName).push(listener);
    }
    subscribeOnce(event, listener) {
        if (!this.chanel) {
            logger.warn('声明事件监听的类必须有chanel属性')
        }
        const eventName = this.chanel + '_' + event;
        eventBus.once(eventName, listener)
        // 添加事件到注册表
        if (!this.eventRegistry.has(eventName)) {
            this.eventRegistry.set(eventName, []);
        }
        this.eventRegistry.get(eventName).push(listener);
    }
    broadCast(event, detail) {
        eventBus.emit(event, detail)
    }
}
