import { sac } from "../../../asyncModules.js";
import { Adapter } from "../adapters/zhipu/index.js";
let { Router } = sac.路由管理器
let modelMap={}
let zhipuAdapter=new Adapter()
let {models} = zhipuAdapter.init()
models['chat/completions'].forEach(
    modelinfo=>{
        let {id}=modelinfo
        let scopedId = zhipuAdapter.nameSpace+'-'+id
        modelMap[scopedId] = modelinfo
    }
)

const 对话补全路由 = new Router()
对话补全路由.post('/completions',async(ctx,next)=>{
    let {messages,model}=ctx.req.body
    console.log(modelMap)
    ctx.body.data =  await modelMap[model].process(messages)
    // ctx.body.data = await chatCompletions(messages,"",modelMap[model])
})
export {对话补全路由 as chatCompletionsRouter}