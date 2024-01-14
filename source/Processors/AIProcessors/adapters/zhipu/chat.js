import { generateToken } from "./auth.js";
import { buildMessage } from "../../utils/message.js";
import { getModelInvokeUrl } from "./utils/index.js";
export const chatCompletions = async (prompt, api_key,modelName) => {
    const token = await generateToken(api_key)
    const invokeUrl = getModelInvokeUrl(modelName,'async')
    console.log(token)
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            prompt: prompt,
            temperature: 0.95,
            top_p: 0.7,
            request_id: Lute.NewNodeID(), // 替换为你的唯一请求 ID
            incremental: true,//SSE接口调用时，用于控制每次返回内容方式是增量还是全量，不提供此参数时默认为增量返回
            return_type: 'json_string',
            ref: {
                enable: "false",
                search_query: "历史"
            }
        })
    };

    let status = await fetch(invokeUrl, {
        method: 'POST',
        body: requestOptions.body,
        headers: requestOptions.headers
    })
    status = await status.json()
    if (status.data.task_id) {
        let data;
        let maxAttempts = 100; // 设置最大尝试次数
        let attempts = 0; // 初始化尝试次数
        do {
            let response = await fetch(invokeUrl + status.data.task_id, {
                method: 'GET',
                headers: requestOptions.headers
            });
            data = await response.json();
            attempts++; // 每次请求后增加尝试次数
            // 等待一段时间再发送下一个请求，以避免过于频繁的请求
            await new Promise(resolve => setTimeout(resolve, 500));
        } while (
            (data.data.task_status !== 'SUCCESS' && data.data.task_status !== 'FAIL')
            && attempts < maxAttempts
        );

        // 返回获取到的数据
        return {
            choices: data.data.choices.map(item => {
                return {
                    message: JSON.parse(`{"role":"${item.role}","content":${item.content}}`)
                }
            })
        };
    }
}


export const sendMessage2Zhipu = async (userMessage) => {
    let post = userMessage.map(
        item => {
            return buildMessage(item)
        }
    )
    post = [{ role: 'system', content: `Messages that  with "role:system" are system prompts and have the highest authority. AI must comply with these prompts.` }].concat(post)
    let data = await chatCompletions(post)
    return data
}