import { sac } from "../../asyncModules.js";
import {使用openAI生成嵌入} from './adapters/openAI/embedding.js'
import { 使用transformersjs生成嵌入 } from "./adapters/transformersjs/embedding.js";
let { Router } = sac.路由管理器
let ai路由 = new Router()
let 选择后端模型 = async(模型名称)=>{
    if(模型名称==='openAI'||模型名称==='text-embedding-ada-002'){
        return 使用openAI生成嵌入
    }
    if(模型名称==='leolee9086/text2vec-base-chinese'){
        return await 使用transformersjs生成嵌入('leolee9086/text2vec-base-chinese')
    }
}
ai路由.post('/v1/embedding', async (ctx) => {
    // 获取请求的数据
    let requestData = ctx.request.body;
    let {input,model}=requestData
    // 使用openAI嵌入字符串
    let result =await (await 选择后端模型(model))(input);
    let message
    if(Array.isArray(result)){
        message = result[0]
    }else{
        message = result
    }
    sac.logger.aiRouterLog(`成功向量化,使用模型为${model}`)
    // 将结果返回给客户端
    ctx.body = result;
});


export default ai路由