import {sac} from '../../../../asyncModules.js'
export const completeHistory=async(history,model)=>{
    let res =  await sac.路由管理器.internalFetch('/ai/v1/chat/completions',{
        method:"POST",
        body:{
            model: model,
            messages: history,
        }
    })
    return await res.body.data
}