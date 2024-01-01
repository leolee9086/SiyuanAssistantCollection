/**
 * 并行处理一组 Promise，并在所有 Promise 完成后返回一个对象，该对象包含两个数组：一个包含成功的结果，另一个包含失败的结果。
 * 如果某个 Promise 失败，不会 reject，而是打印警告并记录失败的 Promise。
 *
 * @param {Promise[]} promises - 需要并行处理的 Promise 数组。
 * @returns {Promise<{ success: any[], failure: any[] }>} 返回一个新的 Promise，解析的值是一个对象，包含两个数组：一个包含成功的结果，另一个包含失败的结果。
 * @example
 * const promises = [Promise.resolve(1), Promise.reject(new Error('fail'))];
 * promiseAllTry(promises).then(console.log); // 输出：{ success: [1], failure: [Error: fail] }
 */
function promiseAllTry(promises) {
    return Promise.allSettled(promises)
        .then(results => {
            let successfulResults = [];
            let failureResults = [];
            results.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    successfulResults.push(result.value);
                } else {
                    console.warn(`Promise ${index} failed with reason: ${result.reason}`);
                    failureResults.push(result.reason);
                }
            });
            return { success: successfulResults, failure: failureResults };
        });
}