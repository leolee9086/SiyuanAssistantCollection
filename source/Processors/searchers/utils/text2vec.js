//这里封装一层,隔离向量化引擎与向量搜索
import { sac } from "../runtime.js";
let {internalFetch}=sac.路由管理器
export const text2vec=async(text)=>{
    //这个的路由提供者是ai模块
    return await internalFetch('/ai/v1/embedding',{
        method:"POST",
        body:{
            //这里其实直接可以不写表示默认
            model:'leolee9086/text2vec-base-chinese',
            input:text,
        },
        //内部调用时需要鉴权的接口也还是要鉴权的
        Headers:{
            //这里鉴权直接使用思源的鉴权码,权限最高
            "Authorization":`Bearer ${globalThis.siyuan.config.api.token}`
        }    
    })
}