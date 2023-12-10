class 流程编排引擎 {
    constructor(路由器) {
        this.路由器 = 路由器;
    }
    // 注册一个任务
    注册任务(任务名称, 任务处理函数, ctx构建器) {
        注册基本路由(任务名称, 任务处理函数, ctx构建器);
    }
    // 执行一个任务
    async 执行任务(ctx = {}) {
        // 查找任务
        const 任务 = this.路由器.stack.find(route => route.path === ctx.path);
        if (!任务) {
            throw new Error('未找到任务: ' + ctx.path);
        }
        // 执行任务
        await 任务.middleware(ctx, () => {});
        // 如果ctx.path被修改，那么执行新的任务
        if (ctx.path !== 任务.path) {
            return await this.执行任务(ctx);
        }
        // 返回上下文的状态
        return ctx.state;
    }
    // 执行一系列的任务
    async 执行任务流程(初始任务名称, ctx = {}) {
        ctx.path = 初始任务名称;
        return await this.执行任务(ctx);
    }
}