/**
 * 锁工具函数，用于防止在异步操作执行期间，新的异步操作开始执行。
 * 
 * @param {Function} fn - 需要执行的异步函数
 * @returns {Function} 返回一个新的函数，这个函数会在锁状态为false时执行异步操作，并在操作开始时将锁状态设置为true，操作结束后将锁状态设置为false
 * 
 * 注意事项：
 * 1. 该函数只适用于异步操作，对于同步操作，不需要使用此函数。
 * 2. 该函数不能防止在异步操作执行期间，同一函数的多次调用。如果需要防止同一函数的多次调用，应该在函数内部处理。
 * 3. 该函数不能保证异步操作的执行顺序，如果需要保证执行顺序，应该在函数内部处理。
 * 
 * 示例：
 * ```javascript
 * async function asyncOperation() {
 *     // 异步操作
 * }
 * 
 * const lockedAsyncOperation = 加内部锁等待执行函数(asyncOperation);
 * 
 * // 调用lockedAsyncOperation将会等待上一个异步操作执行完毕
 * lockedAsyncOperation();
 * ```
 */
export function 加内部锁等待执行函数(fn) {
    let lock = false
    // 返回一个新的函数
    return async function(...args) {
        // 如果锁状态为true，即有异步操作正在执行，则阻塞新的异步操作
        while (lock) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        // 锁状态为false，即没有异步操作正在执行，则开始新的异步操作，并将锁状态设置为true
        lock = true;
        try {
            // 执行异步操作
            return await fn(...args);
        } catch (error) {
            // 捕获并处理错误
            console.error('An error occurred:', error);
            throw error; // 如果你希望在捕获错误后继续抛出错误，可以使用这行代码
        } finally {
            // 无论异步操作的结果如何，都将锁状态设置为false，表示当前的异步操作已经执行完毕
            lock = false;
        }
    };
}

/**
 * 锁工具函数
 * @param {Function} fn - 需要执行的异步函数
 * @returns {Object} 返回一个对象，该对象包含一个名为直到释放的方法，该方法接收一个布尔值作为参数，表示锁的状态
 */
function 锁定(fn) {
    return {
        直到释放: function(锁变量,参数名="释放") {
            return async function(...args) {
                while (!锁变量[参数名]) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
                return await fn(...args);
            };
        }
    };
}