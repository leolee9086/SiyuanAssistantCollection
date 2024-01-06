// workLoop 是实际执行任务的函数
function workLoop(deadline, tasks) {
    while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && tasks.length > 0) {
        const task = tasks.shift(); // 取出任务队列中的第一个任务
        try {
            task(); // 尝试执行任务
        } catch (error) {
            console.error('Task execution failed:', error);
            // 这里可以添加错误处理逻辑
        }
    }
}

// doIdleWork 函数使用 requestIdleCallback 在浏览器空闲时执行任务
function doIdleWork(deadline, tasks) {
    workLoop(deadline, tasks); // 调用 workLoop 函数开始执行任务

    // 如果任务队列中还有未完成的任务，使用 requestIdleCallback 来安排下一次执行
    if (tasks.length > 0) {
        requestIdleCallback((newDeadline) => doIdleWork(newDeadline, tasks));
    }
}