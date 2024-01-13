/**
 * 使用信号取消的防抖函数
 * @param {Function} fn - 需要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} 返回一个新的防抖函数，该函数返回一个AbortSignal对象
 */
function debounceWithSignal(fn, wait) {
    let timeoutId = null; // 用于存储setTimeout的ID
    let abortController = new AbortController(); // 创建一个新的AbortController实例
  
    // 返回一个新的异步函数
    return async function(...args) {
      // 如果已经设置了timeoutId，则清除它，并取消之前的信号
      if (timeoutId) {
        clearTimeout(timeoutId); // 清除之前的setTimeout
        abortController.abort(); // 取消之前的信号
        abortController = new AbortController(); // 创建一个新的信号
      }
  
      // 设置一个新的setTimeout
      timeoutId = setTimeout(async () => {
        try {
          // 等待时间结束后，执行fn函数
          await fn(...args, abortController.signal);
        } catch (e) {
          // 如果执行过程中出现异常，且不是因为中断操作引起的，则在控制台输出错误信息
          if (e.name !== 'AbortError') {
            console.error('函数执行失败:', e);
          }
        }
      }, wait);
      // 返回一个AbortSignal对象，允许调用者在外部取消函数执行
      return abortController.signal;
    };
}


function loopWithSignal(functions, signal) {
    let current = 0; // 当前执行的函数索引 
    // 定义一个异步函数来循环执行函数数组
    async function loop() {
      while (!signal.aborted) {
        await functions[current](); // 执行当前函数
        current = (current + 1) % functions.length; // 更新索引，循环数组
      }
    }
    // 监听信号，如果收到中断信号，则停止循环
    signal.addEventListener('abort', () => {
      console.log('Loop has been aborted');
    });
    // 开始循环
    loop();
}