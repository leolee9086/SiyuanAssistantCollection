import { sac } from "../runtime.js";
//import { seachBlockWithText } from "./simpleTextSearcher.js";
import { importWorker } from "../../../utils/webworker/workerHandler.js";
const module= importWorker(import.meta.resolve('./simpleTextSearcher.js'))
await module.$eval(document.getElementById('protyleLuteScript').textContent)
const blockSearchRouter=new sac.路由管理器.Router()
//使用body进行搜索
blockSearchRouter.post('/text', async (ctx, next) => {
    let 使用原始结果= false 
    let 结果数量 = sac.configurer.get('聊天工具设置', '默认参考数量').$value
    let 标题和文档包含全部内容 = true
    let data =await  module.seachBlockWithText(ctx.req.body.query,{使用原始结果,结果数量,标题和文档包含全部内容})
    console.log(data)
    ctx.body = data
})
//使用query字符串进行搜索
blockSearchRouter.get('/text/:query', async (ctx, next) => {
    let 使用原始结果= false 
    let 结果数量 = sac.configurer.get('聊天工具设置', '默认参考数量').$value
    let 标题和文档包含全部内容 = sac.configurer.get('聊天工具设置', '发送参考时文档和标题块发送全部内容').$value
    let data =await  module.seachBlockWithText(ctx.params.query,{使用原始结果,结果数量,标题和文档包含全部内容})
    ctx.body = data
})
export default blockSearchRouter
