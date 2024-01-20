import { sac } from "../../../asyncModules.js";
import { 使用openAI生成嵌入 } from '../adapters/openAI/embedding.js'
import { 使用transformersjs生成嵌入 } from "../adapters/transformersjs/embedding.js";
import { Adapter } from "../adapters/transformersjs/index.js";
let transformersjsAdapter  =new Adapter()

let { Router } = sac.路由管理器
let 嵌入路由 = new Router()
let 创建嵌入器 = async (model) => {
    if (model === 'openAI' || model === 'text-embedding-ada-002') {
        return 使用openAI生成嵌入
    }
    if (model === 'leolee9086/text2vec-base-chinese') {
        return async (input,model)=>{
            let data= await transformersjsAdapter.prepareEmbedding(input,model)
            return data
        }
    }
    if(model = 'zhipu_embedding'){
        return async (input)=>{
             
        }
    }
}
嵌入路由.post('/',async (ctx) => {
    // 获取请求的数据
    let requestData = ctx.request.body;
    let { input, model } = requestData

    // 使用openAI嵌入字符串
    let func=  await 创建嵌入器(model)
    let result
    try{
        result= await func(input,model);
    }catch(e){
        console.error(e)
    }
    let message
    if (Array.isArray(result)) {
        message = result[0]
    } else {
        message = result
    }
    sac.logger.aiRouterLog(`成功向量化,使用模型为${model}`)
    // 将结果返回给客户端
    ctx.body = result;
})
嵌入路由.post('/:model',async (ctx)=>{
    let requestData = ctx.request.body;
    let { input } = requestData
    let {model} =ctx.params
    // 使用openAI嵌入字符串
    let func=  await 创建嵌入器(model)
    let result = await func(input,model);
    let message
    if (Array.isArray(result)) {
        message = result[0]
    } else {
        message = result
    }
    sac.logger.aiRouterLog(`成功向量化,使用模型为${model}`)
    // 将结果返回给客户端
    ctx.body = result;

})
export {嵌入路由 as embeddingRouter}