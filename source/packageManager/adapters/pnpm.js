process.on('uncaughtException', (error) => {
  // 发送错误消息到父进程
  process.send({ level: 'error', message: error.message, stack: error.stack });
});

process.on('unhandledRejection', (reason, promise) => {
  // 发送错误消息到父进程
  process.send({ level: 'error', message: reason.message, stack: reason.stack });
});

try {
  require('../../../static/node_modules/pnpm/dist/node_modules/v8-compile-cache');
} catch {
  // We don't have/need to care about v8-compile-cache failed
}

global['pnpm__startedAt'] = Date.now()

// 创建一个代理处理程序
const handler = {
  get: function(target, propKey) {
    if (propKey === 'log' || propKey === 'error' || propKey === 'info' || propKey === 'warn') {
      return function(message) {
        // 获取调用堆栈
        const stack = new Error().stack.split('\n').slice(2).join('\n');
        // 发送消息到父进程
        process.send({ level: propKey, message: message, stack: stack });
      };
    } else {
      return target[propKey];
    }
  }
};

// 使用代理对象覆盖 console
console = new Proxy(console, handler);

try {
  return require('../../../static/node_modules/pnpm/dist/pnpm.cjs')
} catch (e) {
  process.send({ level: 'error', message: e.message, stack: e.stack });
}