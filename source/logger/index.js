import fs from '../polyfills/fs.js'
import { pluginInstance as plugin } from '../asyncModules.js';
let chunk = []
function safeStringify(obj, depth = 5, arrayLimit = 50) {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (depth <= 0) {
      return '[Max Depth Reached]';
    }
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        // 移除循环引用
        return '[Circular]';
      }
      cache.add(value);
      if (Array.isArray(value)) {
        // 处理大型数组
        if (value.length > arrayLimit) {
          return `[Array (${value.length})] ${JSON.stringify(value.slice(0, arrayLimit))}...`;
        }
      } else if (Object.keys(value).length > arrayLimit) {
        // 处理大型对象
        const limitedObj = {};
        Object.keys(value).slice(0, arrayLimit).forEach(key => {
          limitedObj[key] = value[key];
        });
        return `[Object (${Object.keys(value).length})] ${JSON.stringify(limitedObj)}...`;
      } else if (value instanceof Error) {
        // 处理 Error 对象
        return value.toString();
      } else if (value instanceof Date) {
        // 将 Date 对象转换为字符串
        return value.toISOString();
      } else if (value instanceof Buffer) {
        // 将 Buffer 转换为字符串
        return value.toString();
      } else if (value instanceof fs.ReadStream) {
        // 将文件流转换为文件路径
        return `File: ${value.path}`;
      }
      depth--;
    }
    return value;
  });
}
const writer = async (...content) => {
  let timeStamp = new Date().toISOString();
  let serializedContent = content.map(item => safeStringify(item));
  chunk.push(`${timeStamp}:${serializedContent.join('  ')}\n`);
  await writeToFile();
};

const writeToFile = async () => {
  let currentHour = new Date().toISOString().slice(0, 13)
  let filename = '/temp/cclog/' + plugin.name + '_' + currentHour + '.txt'
  let filecontent = (await fs.readFile(filename)) || ''
  filecontent += chunk.join('\n')
  await fs.writeFile(filename, filecontent)
  chunk = [] // 清空缓存
}

// 每十分钟执行一次写入操作
setInterval(async () => {
  try {
    if (chunk.length > 0) {
      await writeToFile()
    }
  } catch (error) {
    console.error('写入文件时发生错误:', error)
  }
}, 10 * 60 * 1000)
class 日志记录器原型 {
  constructor(config) {
    this.config = {
      writters: new Map([
        ['log', [{ write: console.log }]],
        ['warn', [{ write: console.warn }]],
        ['info', [{ write: console.info }]],
        ['error', [{ write: console.error }]],
        ['debug', [{ write: console.debug }]]

        /*['log', [{ write: writer }]],
                        ['warn', [{ write: writer }]],
                        ['info', [{ write: writer }]],
                        ['error', [{ write: writer }]],
                        ['debug', [{ write: writer }]]*/
      ]),
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

  async sendLog(日志级别, 日志名称, ...messages) {
    // Check if the level is valid
    if (!this.config.writters.has(日志级别)) {
      throw new Error(`Invalid log level: ${日志级别}`);
    }
    if(!plugin.configurer.get('日志设置',日志名称).$value){
      if(plugin.configurer.get('日志设置',日志名称).$value===undefined){
        console.warn('没有设置日志类型',日志名称,'请注意')
      }
      return
    }
    // Get the current stack trace
    const 原始调用栈 = new Error().stack;
    const lines = 原始调用栈.split('\n')
    const newStackTrace = lines.slice(3).join('\n')  // Join the remaining lines back together
    // Send log message to all writters of the corresponding level
    for (const writter of this.config.writters.get(日志级别)) {
      let 重试次数 = 0;
      while (重试次数 < this.config.maxRetries) {
        try {
          writter.write(日志级别 + ' of ' + 日志名称 + ' :\n ', ...messages, '\n' + 'stack:\n' + newStackTrace);
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
      const level = Array.from(target.config.writters.keys()).find(lvl => prop.endsWith(lvl));
      if (level) {
        const name = prop.slice(0, -level.length);
        return (...messages) => target.sendLog(level, name, ...messages);
      }
    }
    return target[prop];
  }
});

export default 日志代理;