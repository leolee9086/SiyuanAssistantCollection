import { plugin } from "../runtime.js";
export async function completeText(prompt,_options) {
    let options = {
        apiKey: "",
        apiTimeout: 60,
        apiProxy: "",
        apiModel: "",
        apiMaxTokens: 0,
        apiBaseURL: "",
        ...globalThis.siyuan.config.ai.openAI // 使用 siyuan.config.ai.openAI 对象进行初始化
    };
    options={...options,...plugin.configurer.get('模型设置','OPENAI').$value}
    options={...options,..._options}
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