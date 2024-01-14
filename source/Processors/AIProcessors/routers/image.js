import { sac } from "../../../asyncModules.js"
let { Router } = sac.路由管理器
let 图像处理路由 = new Router
图像处理路由.post('/generations', async (ctx, next) => {
    try {
        let {
            prompt, n, size, model, nologo = true
        } = ctx.req.body
        ctx.body = {
            created: Date.now(),
            data: [
                { url: `https://image.pollinations.ai/prompt/${prompt}?size=${size}&nolog=${nologo}&seed=123456` }
            ]
        }
    } catch (error) {
        ctx.status = error.response.status;
        ctx.body = error.response.data;
    }
})
export { 图像处理路由 as imagesRouter }