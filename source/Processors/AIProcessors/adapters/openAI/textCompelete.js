import { getOpenAISetting } from "./config";
export async function completeText(prompt,_options) {
    let options = await getOpenAISetting(_options)
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${options.apiKey}`);
    myHeaders.append("User-Agent", "SiYuan/2.10.2 https://b3log.org/siyuan Electron Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) SiYuan/2.10.2 Chrome/114.0.5735.289 Electron/25.7.0 Safari/537.36");
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify({
            model: options.apiModel,
            prompt: prompt,
            max_tokens: options.apiMaxTokens,
            temperature: Number(options.temperature) ? Number(options.temperature) : 0
        }),
        redirect: 'follow'
    };
    const response = await fetch(`${options.apiBaseURL}/completions`, requestOptions);
    const data = await response.json();
    return data;
}