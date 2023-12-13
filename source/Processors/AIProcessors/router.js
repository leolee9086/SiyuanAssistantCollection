import { sac } from "../../asyncModules.js";
import {使用openAI生成嵌入} from './adapters/openAI/embedding.js'
let { Router } = sac.路由管理器
let ai路由 = new Router()
ai路由.post('/v1/embedding', async (ctx) => {
    // 获取请求的数据
    let requestData = ctx.request.body;
    let {input}=requestData
    // 使用openAI嵌入字符串
    let result = await 使用openAI生成嵌入(input);
    // 将结果返回给客户端
    ctx.body = result;
});
export default ai路由