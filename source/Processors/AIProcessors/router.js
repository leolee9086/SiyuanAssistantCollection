import { sac } from "../../asyncModules.js";
import {使用openAI生成嵌入} from './adapters/openAI/embedding.js'
let { Router } = sac.路由管理器
let ai路由 = new Router()
let 选择后端模型 = (模型名称)=>{
    if(模型名称==='openAI'||模型名称==='text-embedding-ada-002'){
        return 使用openAI生成嵌入
    }
}
ai路由.post('/v1/embedding', async (ctx) => {
    // 获取请求的数据
    let requestData = ctx.request.body;
    let {input,model}=requestData
    // 使用openAI嵌入字符串
    let result = await 选择后端模型(model)(input);
    // 将结果返回给客户端
    ctx.body = result;
});

export default ai路由