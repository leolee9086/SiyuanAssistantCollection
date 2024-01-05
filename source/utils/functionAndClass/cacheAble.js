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