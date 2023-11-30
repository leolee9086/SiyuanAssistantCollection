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