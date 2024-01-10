import fs from '../../polyfills/fs.js'
import { plugin, sac } from '../../asyncModules.js';
import { safeStringify } from './safeStringify.js';
let chunk = []
const writeToFile = async () => {
  let currentHour = new Date().toISOString().slice(0, 13)
  let filename = '/temp/cclog/' + plugin.name + '_' + currentHour + '.txt'
  let filecontent = (await fs.readFile(filename)) || ''
  filecontent += chunk.join('\n')
  await fs.writeFile(filename, filecontent)
  chunk = [] // 清空缓存
}
let addLog = async (messages) => {
  const maxSize = 1024; // 设置最大大小，例如1MB
  let massageString = ""
  let messageSize = 0
  try {
    massageString = JSON.stringify(messages)
    messageSize = new Blob([JSON.stringify(messages)]).size; // 估计大小
  } catch (e) {
    console.error('无法发送消息', e, messages)
    return
  }
  if (messageSize > maxSize) {
    console.error('Message too large to send', messages);
    return; // 如果过大，拒绝发送
  }
  sac.eventBus.emit('logger-add', { messages });
}
let writters = new Map(
  [
    ['log', [{ writeObject: async function (...message) { addLog(message) } }]],
    ['warn', [{ writeObject: async function (...message) { addLog(message) } }]],
    ['info', [{ writeObject: async function (...message) { addLog(message) } }]],
    ['error', [{ writeObject: async function (...message) { addLog(message) } }]],
    ['debug', [{ writeObject: async function (...message) { addLog(message) } }]],

  ]
)

class 日志记录器原型 {
  constructor(config) {
    this.config = {
      writters: writters,
      maxRetries: 5,
      ...config
    };
  }

  addLevel(level, writter) {
    // Validate level name
    if (typeof level !== 'string' || level.trim() === '') {
      throw new Error('Invalid level name');
    }
    // Validate writter
    if (typeof writter !== 'object' || typeof writter.write !== 'function') {
      throw new Error('Invalid writter');
    }
    // Check if the new level conflicts with any existing level
    for (const existingLevel of this.config.writters.keys()) {
      if (level.endsWith(existingLevel) || existingLevel.endsWith(level)) {
        throw new Error(`Level ${level} conflicts with existing level ${existingLevel}`);
      }
    }
    this.config.writters.set(level, [writter]);
  }

  async sendLog(日志级别, 日志名称, options, ...messages) {
    // Check if the level is valid
    if (!this.config.writters.has(日志级别)) {
      throw new Error(`Invalid log level: ${日志级别}`);
    }
    let newStackTrace
    if (options.withStack) {
      const 原始调用栈 = new Error().stack;
      const lines = 原始调用栈.split('\n')
      newStackTrace = lines.slice(3).join('\n')  // Join the remaining lines back together
    }
    /* if (!plugin.configurer.get('日志设置', 日志名称).$value) {
      //将日志级别初始化为false
      if (plugin.configurer.get('日志设置', 日志名称).$value === undefined) {
        plugin.configurer.set('日志设置', 日志名称, false)
        console.warn('没有设置日志类型,初始化为false', 日志名称, '请注意', newStackTrace)
      }
      return
    }*/
    // Get the current stack trace
    // Send log message to all writters of the corresponding level
    for (const writter of this.config.writters.get(日志级别)) {
      let 重试次数 = 0;
      while (重试次数 < this.config.maxRetries) {
        try {
          writter.writeObject && writter.writeObject({
            level: 日志级别,
            name: 日志名称,
            messages: messages,
            stack: newStackTrace && newStackTrace.split("\n")
          });
          writter.write && writter.write(日志级别 + ' of ' + 日志名称 + ' :\n ', ...messages, '\n' + 'stack:\n' + newStackTrace);
          break;  // If the write is successful, break the loop
        } catch (error) {
          console.error(`Failed to send ${日志级别} message to writter:`, error);
          重试次数++;
          if (重试次数 === this.config.maxRetries) {
            // If all retries have failed, report the error
            console.error(`Failed to send ${日志级别} message to writter after ${this.config.maxRetries} retries:`, error);
          }
        }
      }
    }
  }
}

const 日志记录器 = new 日志记录器原型();
const 日志代理 = new Proxy(日志记录器, {
  get(target, prop) {
    if (typeof prop === 'string') {
      // 检查是否是以'log'结尾，这意味着是一个日志级别的调用
      const level = Array.from(target.config.writters.keys()).find(lvl => prop.toLowerCase().endsWith(lvl.toLowerCase()));
      if (level) {
        // 如果是以'log'结尾，返回一个函数，该函数可以链式调用.stack
        return new Proxy(() => { }, {
          get: (_, property) => {
            if (property === 'stack') {
              // 如果访问.stack属性，返回一个新的函数，该函数在调用sendLog时会添加withStack: true
              return (...messages) => target.sendLog(level, prop, { withStack: true }, ...messages);
            }
            // 如果不是.stack属性，返回一个函数，该函数在调用sendLog时不添加withStack标志
            return (...messages) => target.sendLog(level, prop, {}, ...messages);
          },
          apply: (_, thisArg, args) => {
            // 如果直接调用函数（不是链式调用.stack），则直接调用sendLog
            return target.sendLog(level, prop, {}, ...args);
          }
        });
      }
    }
    // 如果不是日志级别的调用，直接返回目标属性
    return target[prop];
  }
});

export default 日志代理;
export { 日志代理 as logger }