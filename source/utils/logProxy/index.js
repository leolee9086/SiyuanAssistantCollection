import { sac } from '../../asyncModules.js';
import { buildLogProxy } from './proxy.js';
import { 去循环序列化, 是否循环引用 } from './safeStringify.js';
export let chunk = []
let addLog = async (messages) => {
  const maxSize = 1024; // 设置最大大小，例如1MB
  let massageString = ""
  let messageSize = 0
  try {
    massageString = 去循环序列化(messages)
    messageSize = new Blob([去循环序列化(messages)]).size; // 估计大小
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

  添加日志级别(level, writter) {
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

  async sendLog(logLevel, logName, options, ...messages) {
    this.validateLogLevel(logLevel);
    let newStackTrace = this.extractStackTrace(options);
    await this.writeLogMessages(logLevel, logName, newStackTrace, messages);
  }

  validateLogLevel(logLevel) {
    if (!this.config.writters.has(logLevel)) {
      throw new Error(`Invalid log level: ${logLevel}`);
    }
  }

  extractStackTrace(options) {
    if (options.withStack) {
      const originalStackTrace = new Error().stack;
      return originalStackTrace.split('\n').slice(3).join('\n');
    }
    return null;
  }

  async writeLogMessages(logLevel, logName, newStackTrace, messages) {
    for (const writter of this.config.writters.get(logLevel)) {
      let retryCount = 0;
      while (retryCount < this.config.maxRetries) {
        try {
          await this.写入日志(writter, logLevel, logName, newStackTrace, messages);
          break;
        } catch (error) {
          console.error(`Failed to send ${logLevel} message to writter:`, error);
          retryCount++;
          if (retryCount === this.config.maxRetries) {
            console.error(`Failed to send ${logLevel} message to writter after ${this.config.maxRetries} retries:`, error);
          }
        }
      }
    }
  }
  async 写入日志(writter, logLevel, logName, newStackTrace, messages) {
    if (writter.writeObject) {
      await writter.writeObject({
        level: logLevel,
        name: logName,
        messages: messages.map(message => { return !是否循环引用(message)? message : 去循环序列化(message) }),
        stack: newStackTrace && newStackTrace.split("\n")
      });
    }
    if (writter.write) {
      await writter.write(`${logLevel} of ${logName} :\n`, ...messages, '\nstack:\n' + newStackTrace);
    }
  }
}

const 日志记录器 = new 日志记录器原型();
const 日志代理 = buildLogProxy(日志记录器)
export default 日志代理;
export { 日志代理 as logger }