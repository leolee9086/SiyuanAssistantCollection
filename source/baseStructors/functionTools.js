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
function 柯里化(原始函数) {
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