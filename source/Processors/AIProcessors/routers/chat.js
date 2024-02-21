import { sac } from "../../../asyncModules.js";
import { modelLoader } from "../adapters/loader.js";

let { Router } = sac.路由管理器;

const 对话补全路由 = new Router();

对话补全路由.post('/completions', async (ctx, next) => {
    let { messages, model } = ctx.req.body;
    try {
        // 使用modelLoader获取模型处理函数
        const modelProcess = modelLoader.getModelProcess(model);
        if (modelProcess && modelProcess.process) {
            ctx.body.data = await modelProcess.process(messages);
        } else {
            throw new Error('模型处理函数未定义');
        }
    } catch (error) {
        ctx.status = 404;
        ctx.body = { error: error.message };
    }
});

对话补全路由.post('/listModels', async (ctx, next) => {
    // 直接使用modelLoader列出所有模型
    ctx.body.data = modelLoader.listModels();
});

export { 对话补全路由 as chatCompletionsRouter };