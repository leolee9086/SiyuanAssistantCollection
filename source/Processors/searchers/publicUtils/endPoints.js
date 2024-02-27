import { sac } from "../../../asyncModules.js";
let {internalFetch}=sac.路由管理器


export const searchBlock=async(text)=>{
    let body ={
        query:text
    }
    let res = await internalFetch(
        '/search/blocks/text',{
            method:"POST",
            body
        }
    )
    console.log(res,text)
    return res.body
}