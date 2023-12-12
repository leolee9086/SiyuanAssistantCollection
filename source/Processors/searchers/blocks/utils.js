import { sac } from "../runtime.js"
export const 生成文本向量=async(文本输入)=>{
    return await sac.路由管理器.internalFetch('/ai/v1/embedding',{
        body:{
            input:文本输入
        },
        method:'POST'
    })
}