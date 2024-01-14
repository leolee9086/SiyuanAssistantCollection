import { zhipu_v3_base_url } from "../constants.js"
export const getModelInvokeUrl =(model,envokeType)=>{
    if(envokeType==='async'){
        return `${zhipu_v3_base_url}/${model}/async-invoke/`
    }else if(envokeType==='sse'){
        return `${zhipu_v3_base_url}/${model}/async-invoke/`
    }
}