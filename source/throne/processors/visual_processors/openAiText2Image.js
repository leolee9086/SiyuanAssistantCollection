import { plugin } from '../../../asyncModules.js'
let options = JSON.parse(JSON.stringify(plugin.configurer.get('模型设置', 'OPENAI').$value))
options.apiModel = options.apiModel && (options.apiModel.$value || options.apiModel)
options.temperature = options.temperature && (options.temperature.$value)
export const generateImageWithRawPrompt = async (prompt, size) => {
    let options = JSON.parse(JSON.stringify(plugin.configurer.get('模型设置', 'OPENAI').$value))
    options.apiModel = options.apiModel && (options.apiModel.$value || options.apiModel)
    options.temperature = options.temperature && (options.temperature.$value)
    let merged = { ...globalThis.siyuan.config.ai.openAI };
    for (let key in options) {
      if (options[key]) {
        merged[key] = options[key];
      }
    }
   let myHeaders=new Headers()

    myHeaders.append(
        "Authorization",
        merged.apiKey
    );
    myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
        prompt,
        response_format: "url",
        size: size ? size : "1024x1024",
    });
    var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
    };
    let res = await fetch(
        merged.apiBaseURL+"/images/generations",
        requestOptions
    );
    let url = (await res.json()).data[0].url;
    return url
}
window.generateImageWithRawPrompt=generateImageWithRawPrompt