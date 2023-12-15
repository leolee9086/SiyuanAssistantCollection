import { sac } from "../runtime.js";
//import { seachBlockWithText } from "./simpleTextSearcher.js";
import { importWorker } from "../../../utils/webworker/workerHandler.js";
import { text2vec } from "../utils/text2vec.js";
const simpleTextSearcherModule= importWorker(import.meta.resolve('./simpleTextSearcher.js'))
await simpleTextSearcherModule.$eval(document.getElementById('protyleLuteScript').textContent)
const vectorTextSearcherModule= importWorker(import.meta.resolve('./vectorSearcher.js'))
await vectorTextSearcherModule.$eval(document.getElementById('protyleLuteScript').textContent)

const blockSearchRouter=new sac.路由管理器.Router()
//使用body进行搜索
blockSearchRouter.post('/text', async (ctx, next) => {
    let 使用原始结果= false 
    let 结果数量 = sac.configurer.get('聊天工具设置', '默认参考数量').$value
    let 标题和文档包含全部内容 = true
    let data =await  simpleTextSearcherModule.seachBlockWithText(ctx.req.body.query,{使用原始结果,结果数量,标题和文档包含全部内容})
    console.log(data)
    ctx.body = data
})
//使用query字符串进行搜索
blockSearchRouter.get('/text/:query', async (ctx, next) => {
    let 使用原始结果= false 
    let 结果数量 = sac.configurer.get('聊天工具设置', '默认参考数量').$value
    let 标题和文档包含全部内容 = sac.configurer.get('聊天工具设置', '发送参考时文档和标题块发送全部内容').$value
    let data =await  simpleTextSearcherModule.seachBlockWithText(ctx.params.query,{使用原始结果,结果数量,标题和文档包含全部内容})
    ctx.body = data
})
blockSearchRouter.post('/vector',async(ctx,next)=>{
    let 使用原始结果=false 
    let 结果数量 = sac.configurer.get('聊天工具设置', '默认参考数量').$value
    let 标题和文档包含全部内容 = sac.configurer.get('聊天工具设置', '发送参考时文档和标题块发送全部内容').$value
    let 得分阈值=0.5
    let 参考分数较高时给出文档全文=sac.configurer.get('聊天工具设置', '参考分数较高时给出文档全文').$value
    let res = await text2vec(ctx.req.body.query)
    let vector = res.body.data[0].embedding
    console.log(res,vector)

    let res1 = await sac.路由管理器.internalFetch('/database/query',{
        body: {
            vector:vector,
            collection_name:'blocks',
            limit:结果数量,
            offset:8,
            filter:'',
            output_fields:'meta'
        },
        method: 'POST',
    })
    console.log(res1)
    let data =await vectorTextSearcherModule.seachBlockWithVector(res1.body.data,标题和文档包含全部内容,使用原始结果,得分阈值,参考分数较高时给出文档全文)
    ctx.body=data
})
blockSearchRouter.get('/vector/:query',async(ctx,next)=>{
    let 使用原始结果=false 
    let 结果数量 = sac.configurer.get('聊天工具设置', '默认参考数量').$value
    let 标题和文档包含全部内容 = sac.configurer.get('聊天工具设置', '发送参考时文档和标题块发送全部内容').$value
    let 得分阈值=0.8
    let 参考分数较高时给出文档全文=sac.configurer.get('聊天工具设置', '参考分数较高时给出文档全文').$value
    let res = await text2vec(ctx.params.query)
    let vector = res.body.data[0].embedding
    let res1 = await sac.路由管理器.internalFetch('/database/query',{
        body: {
            vector:vector,
            collection_name:'blocks',
            limit:结果数量,
            offset:8,
            filter:'',
            output_fields:'meta'
        },
        method: 'POST',
    })
    let data =await vectorTextSearcherModule.seachBlockWithVector(res1.body.data,标题和文档包含全部内容,使用原始结果,得分阈值,参考分数较高时给出文档全文)
    ctx.body=data
})
export default blockSearchRouter
