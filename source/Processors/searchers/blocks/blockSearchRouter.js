import { sac } from "../runtime.js";
import { seachBlockWithText } from "./simpleTextSearcher.js";
const blockSearchRouter=new sac.路由管理器.Router()
blockSearchRouter.post('/text', async (ctx, next) => {
    let data = await seachBlockWithText(ctx.req.body.query)
    ctx.body = data
})
blockSearchRouter.get('/text/:query', async (ctx, next) => {
    let data = await seachBlockWithText(ctx.params.query)
    ctx.body = data
})
export default blockSearchRouter
