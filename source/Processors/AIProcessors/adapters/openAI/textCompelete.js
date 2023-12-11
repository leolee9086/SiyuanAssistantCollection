import { getOpenAISetting } from "./config";
import { myHeaders } from "./myHeader";
export async function completeText(prompt, _options) {
    let options = await getOpenAISetting(_options)
    let headers = myHeaders(options)
    let raw= JSON.stringify({
        model: options.apiModel,
        prompt: prompt,
        max_tokens: options.apiMaxTokens,
        temperature: Number(options.temperature) ? Number(options.temperature) : 0
    })
    const requestOptions = {
        method: 'POST',
        headers: headers,
        body: raw,
        redirect: 'follow'
    };
    const response = await fetch(`${options.apiBaseURL}/completions`, requestOptions);
    const data = await response.json();
    return data;
}