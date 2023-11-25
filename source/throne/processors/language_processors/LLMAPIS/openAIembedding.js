export async function 使用openAI生成嵌入(textContent, options = {}) {
    options = {
        options,
        ...globalThis.siyuan.config.ai.openAI,
    }
    let _options
    if (globalThis.modelSetting.OPENAI) {
        let OPENAI = globalThis.modelSetting.OPENAI
        _options = {
            "apiBaseURL": OPENAI.apiBaseURL,
            "apiKey": OPENAI.apiKey,
        }
        options = {
            options,
            ..._options
        }
    }
    let myHeaders = new Headers();
    myHeaders.append(
        "Authorization",
        `Bearer ${options.apiKey}`
    );
    myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
    myHeaders.append("Content-Type", "application/json");
    let raw = JSON.stringify({
        "model": "text-embedding-ada-002",
        "input": textContent
    });
    let requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };
    try {
        let data = await fetch(
            `${options.apiBaseURL}/embeddings`,
            requestOptions
        );
        let embedding = (await data.json()).data[0].embedding;
        return { data: embedding }

    } catch (e) {
        return
    }
}