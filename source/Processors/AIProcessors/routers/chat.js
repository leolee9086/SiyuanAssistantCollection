import { sac } from "../../../asyncModules.js";
import { chatCompletions } from "../adapters/zhipu/chat.js";
let { Router } = sac.路由管理器
let modelMap={
    'zhipu-characterglm':"characterglm",
    'zhipu-chatglm-turbo':"chatglm_turbo",
    'zhipu-chatglm-pro':"chatglm_pro"
}

const 对话补全路由 = new Router()
对话补全路由.post('/completions',async(ctx,next)=>{
    let {messages,model}=ctx.req.body
    ctx.body.data =  await chatCompletions(messages,'729c9a1a27f517607c3c589cfcb12c1c.G4dVYc6SjaSiDbHE',modelMap[model])
   // ctx.body.data = await chatCompletions(messages,"",modelMap[model])
})
export {对话补全路由 as chatCompletionsRouter}