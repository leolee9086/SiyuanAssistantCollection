import { getOpenAISetting } from "./config.js";
import { myHeaders } from "./myHeader.js";
export async function 使用openAI生成嵌入(textContent, _options = {}) {
    let options = await getOpenAISetting(_options)
    let headers = myHeaders(options)
    let raw = JSON.stringify({
        "model": "text-embedding-ada-002",
        "input": textContent
    });
    let requestOptions = {
        method: "POST",
        headers: headers,
        body: raw,
        redirect: "follow",
    };
    try {
        let data = await fetch(
            `${options.apiBaseURL}/embeddings`,
            requestOptions
        );
        return await data.json()
    } catch (e) {
        return
    }
}