import { pluginInstance as plugin } from "../asyncModules.js";
import logger from "../logger/index.js";
let eventBus
class EventBusDummy {
    constructor() {
      this.listeners = {};
    }
  
    on(event, callback) {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
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
      if (!this.listeners[event]) {
        return;
      }
      this.listeners[event].forEach(callback => callback(data));
    }
  }



if(plugin){
    eventBus=plugin.eventBus
}else{
    //在worker中
    eventBus =new EventBusDummy() 
}
export class EventEmitter {
    constructor(chanel) {
        this.eventRegistry = new Map();  // 事件注册表
        this.chanel = chanel
    }
    on(event, listener) {
        if(!this.chanel){
            logger.warn('声明事件监听的类必须有chanel属性')
        }
        const eventName = this.chanel+'_' + event;
        eventBus.on(eventName, listener)
        // 添加事件到注册表
        if (!this.eventRegistry.has(eventName)) {
            this.eventRegistry.set(eventName, []);
        }
        this.eventRegistry.get(eventName).push(listener);
    }
    onRaw(event, listener){
        eventBus.on(event, listener)
        // 添加事件到注册表
        if (!this.eventRegistry.has(event)) {
            this.eventRegistry.set(event, []);
        }
        this.eventRegistry.get(event).push(listener);
    }
    removeListener(event, listener) {
        eventBus.off(event, listener)
        // 从注册表中移除事件
        const listeners = this.eventRegistry.get(event);
        if (listeners) {
            const index = listeners.indexOf(listener);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
    }
    onceRaw(event, listener){
        eventBus.once(event, listener)
        // 添加事件到注册表
        if (!this.eventRegistry.has(event)) {
            this.eventRegistry.set(event, []);
        }
        this.eventRegistry.get(event).push(listener);
    }
    once(event, listener) {
        if(!this.chanel){
            logger.warn('声明事件监听的类必须有chanel属性')
        }
        const eventName = this.chanel+'_' + event;
        eventBus.once(eventName, listener)
        // 添加事件到注册表
        if (!this.eventRegistry.has(eventName)) {
            this.eventRegistry.set(eventName, []);
        }
        this.eventRegistry.get(eventName).push(listener);
    }

    emit(event, detail) {
        eventBus.emit(event, detail)
    }
}
