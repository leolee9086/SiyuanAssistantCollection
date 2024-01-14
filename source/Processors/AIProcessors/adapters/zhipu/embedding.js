import { generateToken } from "./auth"
import { zhipu_text_embedding_url } from "./constants";

export const 使用智谱生成嵌入= async(text,api_key)=>{
    const token = await generateToken(api_key)
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            prompt: text,
            request_id: Lute.NewNodeID(), // 替换为你的唯一请求 ID
        })
    };
    let response = await fetch(zhipu_text_embedding_url,{
        method:"POST",
        body: requestOptions.body,
        headers: requestOptions.headers
    })
    try{
        let data=await response.json()
        return data.embedding
    }catch(e){
        return {
            error:data.msg
        }
    }
}