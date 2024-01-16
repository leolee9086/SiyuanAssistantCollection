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
      let 封装函数 =function (...args)  {
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

/**
 * 创建一个新的函数，该函数是输入函数的顺序组合。
 * 新函数的输出是由原函数按照从右到左的顺序计算得出的。
 * 
 * @param {...Function} 函数数组 - 任意数量的函数，它们将被组合成一个新的函数。
 * @returns {Function} 返回一个新的函数，该函数接受任意数量的参数，并将这些参数依次传递给每一个函数。
 * 
 * @example
 * function double(x) { return x * 2; }
 * function square(x) { return x * x; }
 * function increment(x) { return x + 1; }
 * let incrementSquareOfDouble = 顺序组合函数(increment, square, double);
 * console.log(incrementSquareOfDouble(5));  // 输出：51
 */
function 顺序组合函数(...函数数组) {
  return 函数数组.reduce((f, g) => (...args) => f(g(...args)));
}

/**
* 创建一个新的函数，该函数是输入函数的顺序组合。
* 新函数的输出是由原函数按照从左到右的顺序计算得出的。
* 
* @param {...Function} 函数数组 - 任意数量的函数，它们将被组合成一个新的函数。
* @returns {Function} 返回一个新的函数，该函数接受任意数量的参数，并将这些参数依次传递给每一个函数。
* 
* @example
* function double(x) { return x * 2; }
* function square(x) { return x * x; }
* function increment(x) { return x + 1; }
* let doubleSquareIncrement = 管道函数(double, square, increment);
* console.log(doubleSquareIncrement(5));  // 输出：26
*/
function 管道函数(...函数数组) {
  return 函数数组.reduceRight((f, g) => (...args) => f(g(...args)));
}


/**
* 创建一个柯里化版本的函数。
* 
* @param {Function} 原始函数 - 需要被柯里化的原始函数。
* @returns {Function} 返回一个新的函数，这个函数会收集所有传递给它的参数，直到这些参数的数量达到了原始函数的参数数量，然后它会调用原始函数并传递所有收集到的参数。
* 
* @example
* let add = (a, b, c) => a + b + c;
* let curriedAdd = 柯里化(add);
* console.log(curriedAdd(1)(2)(3));  // 输出 6
* console.log(curriedAdd(1, 2)(3));  // 输出 6
* console.log(curriedAdd(1, 2, 3));  // 输出 6
*/
export  function 柯里化(原始函数) {
  return function 柯里化版本函数(...输入参数) {
      //原始函数.length
      if (输入参数.length >= 原始函数.length) {
          return 原始函数.apply(this, 输入参数);
      } else {
          return function(...args2) {
              return 柯里化版本函数.apply(this, 输入参数.concat(args2));
          }
      }
  };
}

export function 逆序柯里化(原始函数) {
  function 逆序柯里化内部(已收集参数) {
    return function(...新参数) {
      // 将新参数逆序并与已收集的参数合并
      const 所有参数 = 新参数.reverse().concat(已收集参数);
      if (所有参数.length >= 原始函数.length) {
        // 如果收集的参数足够，则逆序并调用原始函数
        return 原始函数(...所有参数.reverse());
      } else {
        // 否则返回一个新函数继续收集参数
        return 逆序柯里化内部(所有参数);
      }
    };
  }
  // 开始逆序柯里化过程，初始没有已收集的参数
  return 逆序柯里化内部([]);
}

let test = (a, b, c, d) => a / b / c / d;
console.log(逆序柯里化(test)(1)(2)(3)(4)); // 应该输出 0.041666666666666664，即 1 / (2 / (3 / 4))
console.log(逆序柯里化(test)(1, 2, 3, 4)); // 应该输出 0.041666666666666664，即 1 / (2 / (3 / 4))
export function 等待参数达到长度后执行(原始函数, 预定长度) {
  let 柯里化版本函数 = 柯里化(原始函数);
  return function(...输入参数) {
      if (输入参数.length >= 预定长度) {
          return 柯里化版本函数(...输入参数);
      } else {
          return function(...args2) {
              return 柯里化版本函数(...输入参数, ...args2);
          }
      }
  };
}

export function 组合函数(...函数数组){
  // 使用 Array.prototype.flat 来确保函数数组总是一维的
  函数数组 = 函数数组.flat();
  // 类型检查：确保函数数组的每个元素都是函数
  函数数组.forEach(fn => {
      if (typeof fn !== 'function') {
          throw new TypeError('组合函数的参数必须都是函数');
      }
  });

  let 组合结果 = async function(...args) {
      // 使用 Promise.all 来并行执行所有的函数，并处理错误
      let results = await Promise.all(函数数组.map(fn => {
          try {
              return fn(...args);
          } catch (error) {
              console.error('在执行函数时发生错误:', error);
              return null;
          }
      }));

      // 移除所有的 null 值
      results = results.filter(result => result !== null);
      return results;
  };

  // 添加 add 方法
  组合结果.add = function(...fn) {
      // 类型检查：确保添加的每个元素都是函数
      fn.flat().forEach(fn => {
          if (typeof fn !== 'function') {
              throw new TypeError('add方法的参数必须都是函数');
          }
      });

      函数数组=函数数组.concat(fn.flat());
  };

  return 组合结果;
}

//https://www.npmjs.com/package/tiny-async-pool?activeTab=code
export async function* asyncPool(concurrency, iterable, iteratorFn) {
  const executing = new Set();
  async function consume() {
    const [promise, value] = await Promise.race(executing);
    executing.delete(promise);
    return value;
  }
  for (const item of iterable) {
    // Wrap iteratorFn() in an async fn to ensure we get a promise.
    // Then expose such promise, so it's possible to later reference and
    // remove it from the executing pool.
    const promise = (async () => await iteratorFn(item, iterable))().then(
      value => [promise, value]
    );
    executing.add(promise);
    if (executing.size >= concurrency) {
      yield await consume();
    }
  }
  while (executing.size) {
    yield await consume();
  }
}
/**
 * 创建一个特殊的柯里化函数，该函数按照指定的参数顺序进行柯里化。
 *
 * @param {Function} func - 需要被柯里化的原始函数。
 * @param {Array} paramsOrder - 参数的顺序。
 * @returns {Function} 返回一个新的函数，这个函数会按照指定的参数顺序收集所有传递给它的参数，直到这些参数的数量达到了原始函数的参数数量，然后它会调用原始函数并传递所有收集到的参数。
 */
function specialCurry(func, paramsOrder) {
  const params = {};

  const curried = (...args) => {
    args.forEach((arg, index) => {
      params[paramsOrder[index]] = arg;
    });

    if (Object.keys(params).length >= func.length) {
      return func(...Object.values(params));
    } else {
      return curried;
    }
  };

  return curried;
}