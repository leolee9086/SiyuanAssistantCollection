import { sac } from "../../asyncModules.js";
import { chatCompletionsRouter } from "./routers/chat.js";
import { embeddingRouter } from "./routers/embedding.js";
import { imagesRouter } from "./routers/image.js";
let { Router } = sac.路由管理器
let ai路由 = new Router()


ai路由.post(
    '/v1/threads/:threadsName', async (ctx) => {
        const threadsName = ctx.params.threadsName;
        const { text, options } = ctx.request.body;
        const apiKey = process.env.OPENAI_API_KEY; // 假设您的API密钥存储在环境变量中
        const headers = {
            'Authorization': `Bearer ${apiKey}`,
            // 其他可能需要的头部信息
        };
    }
)
ai路由.use('/v1/embedding',embeddingRouter.routes())
ai路由.use('/v1/images', imagesRouter.routes())
ai路由.use('/v1/chat', chatCompletionsRouter.routes())

ai路由.post(
    '/v1/images/edits', async (ctx) => {

    })
ai路由.post(
    '/v1/images/variations', async (ctx) => {

    })
ai路由.post(
    '/v1/models', async (ctx) => {

    }
)

ai路由.post(
    '/v1/assistans/list', async (ctx) => {
        console.log(ctx)
    }
)
ai路由.post(
    '/v1/audio/speech', async (ctx) => {

    }
)
ai路由.post(
    '/v1/audio/transcriptions', async (ctx) => {

    }
)
ai路由.post(
    '/v1/audio/translations', async (ctx) => {

    }
)



ai路由.post(
    '/v1/fine_tuning/jobs', async (ctx) => {

    })
ai路由.get(
    '/v1/fine_tuning/jobs', async (ctx) => {

    })
ai路由.get(
    '/v1/fine_tuning/:fine_tuning_job_id/jobs', async (ctx) => {

    })
///v1/fine_tuning/jobs/{fine_tuning_job_id}
///v1/fine_tuning/jobs/{fine_tuning_job_id}/cancel
///v1/files

export default ai路由