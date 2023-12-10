import { sac } from "./runtime.js";
import { seachBlockWithText } from "./blocks/simpleTextSearcher.js";
const {Router}=sac.路由管理器
let searchersRouter = new Router
searchersRouter.post('/blocks/text',async(ctx,next)=>{
    let data = await seachBlockWithText(ctx.req.body.query)
    ctx.body=data
})
export {searchersRouter}
