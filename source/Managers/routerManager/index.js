import _Router from "./router.js"
import { sac } from "../../asyncModules.js"
export const 根路由 = new _Router()
export const Router = _Router
export const 注册基本路由 = (路由名称, 基本路由, ctx构建器) => {
    // 检查基本路由和ctx构建器是否提供
    if (!基本路由 || !ctx构建器) {
        throw new Error('必须提供基本路由和ctx构建器');
    }

    // 检查基本路由是否是函数
    if (typeof 基本路由 !== 'function') {
        throw new Error('基本路由必须是函数');
    }
    // 检查ctx构建器是否是函数
    if (typeof ctx构建器 !== 'function') {
        throw new Error('ctx构建器必须是函数');
    }
    // 创建中间件函数
    const 中间件 = async (ctx, next) => {
        // 使用ctx构建器构建上下文
        const 新ctx = ctx构建器(ctx);

        // 调用基本路由处理请求
        await 基本路由(新ctx, next);
    };
    // 将中间件添加到路由
    sac.根路由.all(路由名称, 中间件);
};
export const internalFetch = async (path, options = {}) => {
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
    const fetchPromise = sac.路由管理器.根路由.routes('/')(ctx, (ctx, next) => {
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