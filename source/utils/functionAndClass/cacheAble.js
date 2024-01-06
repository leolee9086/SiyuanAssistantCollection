/**
 * 创建一个简单的缓存函数
 * @param {Function} fn 需要被缓存的函数
 * @param {number} ttl 缓存的有效期（毫秒）
 * @returns {Function} 返回一个新的函数，这个新函数会在被调用时检查缓存，如果缓存中有对应的结果就直接返回，否则就调用原函数并将结果存入缓存
 */
export const 创建简单缓存函数 = (fn, ttl) => {
    let 缓存 = {};
    return function (...参数) {
        let 键 = JSON.stringify(参数);
        if (缓存[键]) {
            return 缓存[键];
        } else {
            let 结果 = fn(...参数);
            缓存[键] = 结果;
            setTimeout(() => {
                delete 缓存[键];
            }, ttl);
            return 结果;
        }
    };
}


export const 封装对象函数使用缓存 = (obj) => {
    const 函数执行时间 = {};
    const 缓存 = {};
  
    const 封装函数 = (fn, fnName) => {
      return async function (...参数) {
        const 现在 = performance.now();
        const 键 = `${fnName}_${JSON.stringify(参数)}`;
        const 上次执行时间 = 函数执行时间[fnName] || 0;
        const 上次执行结束 = 缓存[键]?.时间 || 0;
        const 平均运行时间 = 上次执行时间 / (缓存[键]?.次数 || 1);
  
        if (缓存[键] && (现在 - 上次执行结束 < 平均运行时间)) {
          return 缓存[键].结果;
        }
  
        const 结果 = await fn.apply(this, 参数);
        const 执行结束 = performance.now();
        const 执行时间 = 执行结束 - 现在;
  
        函数执行时间[fnName] = (函数执行时间[fnName] || 0) + 执行时间;
        缓存[键] = { 结果, 时间: 执行结束, 次数: (缓存[键]?.次数 || 0) + 1 };
  
        return 结果;
      };
    };
  
    const 封装对象 = {};
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'function') {
        封装对象[key] = 封装函数(obj[key], key);
      }
    });
  
    return 封装对象;
  };