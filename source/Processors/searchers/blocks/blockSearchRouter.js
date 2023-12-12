import { sac } from "../runtime.js";
import { seachBlockWithText } from "./simpleTextSearcher.js";
import { 生成文本向量 } from "./utils.js";
const blockSearchRouter=new sac.路由管理器.Router()
//使用body进行搜索
blockSearchRouter.post('/text', async (ctx, next) => {
    let data = await seachBlockWithText(ctx.req.body.query)
    ctx.body = data
})
//使用query字符串进行搜索
blockSearchRouter.get('/text/:query', async (ctx, next) => {
    let data = await seachBlockWithText(ctx.params.query)
    ctx.body = data
})
console.log(await 生成文本向量('测试'))
export default blockSearchRouter
