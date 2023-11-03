let 封装表 = new Map();
  // 辅助函数：智能防抖函数
export  function 智能防抖(原始函数, 失败回调, 预期平均时间) {
    if (!封装表.has(原始函数)) {
      let 封装数据 = {
        上次执行时间: 0,
        总实际执行时间: 0,
        执行次数: 0,
        平均执行时间: 0
      };
      封装表.set(原始函数, 封装数据);
      let _预期平均时间 = 预期平均时间 ? 预期平均时间 : 0
      let 封装函数 = (...args) => {
        const 当前时间 = Date.now();
        const 当次执行间隔 = 当前时间 - 封装数据.上次执行时间;
        if (当次执行间隔 < Math.max(封装数据.平均执行时间, _预期平均时间)) {
          失败回调 instanceof Function ? 失败回调(当次执行间隔, 封装数据.平均执行时间) : null;
          return undefined; // 阻断函数的执行
        }
        封装数据.上次执行时间 = 当前时间; // 更新上次执行时间
        let 执行结果 = 原始函数(...args);
        // 检查函数是否是异步的
        if (执行结果 instanceof Promise) {
          // 如果函数是异步的，就返回一个异步函数
          return 执行结果.then(result => {
            const 实际执行时间 = Date.now() - 当前时间;
            封装数据.执行次数++;
            封装数据.总实际执行时间 += 实际执行时间;
            封装数据.平均执行时间 = 封装数据.总实际执行时间 / 封装数据.执行次数;
            return result;
          });
        } else {
          // 如果函数是同步的，就直接返回执行结果
          const 实际执行时间 = Date.now() - 当前时间;
          封装数据.执行次数++;
          封装数据.总实际执行时间 += 实际执行时间;
          封装数据.平均执行时间 = 封装数据.总实际执行时间 / 封装数据.执行次数;
          return 执行结果;
        }
      };
      封装表.get(原始函数).封装函数 = 封装函数;
      return 封装函数;
    } else {
      return 封装表.get(原始函数).封装函数;
    }
  }
export   function 防抖(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}