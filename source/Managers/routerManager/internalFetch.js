export const internalFetch = async (path, options = {},router) => {
    // 创建上下文对象
    const ctx = {
        path,
        method: options.method || 'GET',
        get body(){
            return this.response.body
        },
        headers: options.headers || {},
        status: 200,
        get res(){
            return this.response
        },
        get req(){
            return this.request
        },
        set body(body){
            this.response.body= body
        },
        request: {
            body: options.body,
            params: {}
        },
        response: {
            body:{}
        },
        state: {
        }
    };
    // 创建一个 Promise，当 signal 的 abort 事件被触发时，这个 Promise 会被拒绝
    const abortPromise = new Promise((resolve, reject) => {
        if (options.signal) {
            options.signal.addEventListener('abort', () => {
                reject(new Error('Aborted'));
            });
        }
    });
    // 查找本地函数
    const fetchPromise = router.routes('/')(ctx, (ctx, next) => {
        console.log(ctx)
    });
    // 等待 fetchPromise 完成或 abortPromise 被拒绝
    const result = await Promise.race([fetchPromise, abortPromise]);
    // 如果没有找到匹配的路由，设置状态为404
    if (!result) {
        ctx.status = 404;
    }
    // 如果ctx.path被修改，那么执行新的本地函数
    if (ctx.path !== path) {
        return await internalFetch(ctx.path, options);
    }

    // 返回上下文的状态
    return ctx;
};