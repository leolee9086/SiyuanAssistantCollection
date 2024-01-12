export const buildLogProxy=(日志记录器)=>{
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
    return 日志代理
}