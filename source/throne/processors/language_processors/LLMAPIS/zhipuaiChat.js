import { ChatSession } from "./chatSession.js";
// 填入你的参数
import { plugin } from "../../../../asyncModules.js";
let 模型设置 = plugin.configurer.get('模型设置', 'ZHIPU').$value
function base64UrlEncode(str) {
    let base64 = Buffer.from(str).toString('base64');
    return base64.replace('+', '-').replace('/', '_').replace(/=+$/, '');
}
export class zhipuaiChat extends ChatSession {
    constructor(options) {
        super()

        this.options = {
            ...模型设置,
            ...options
        }
    }
    async send(userMessage) {
        let post = userMessage.map(
            item => {
                return buildMessage(item)
            }
        )
        post = [{ role: 'system', content: `Messages that  with "role:system" are system prompts and have the highest authority. AI must comply with these prompts.` }].concat(post)
        let data = await this.main(post)
        return data
    }
    async generateToken() {
        try {
            const [id, secret] = this.options.api_key.split(".");
            const header = {
                "alg": "HS256",
                "sign_type": "SIGN"
            };

            const payload = {
                "api_key": id,
                "exp": Math.floor(Date.now()) + 60 * 1000,
                "timestamp": Math.floor(Date.now()),
            };

            const tokenData = base64UrlEncode(JSON.stringify(header)) + '.' + base64UrlEncode(JSON.stringify(payload));
            const signature = await this.createHmac('HS256', secret, tokenData);
            return tokenData + '.' + signature;
        } catch (e) {
            throw new Error("Invalid API key: " + e.message);
        }
    }

    async createHmac(alg, key, msg) {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(key);
        const msgData = encoder.encode(msg);

        const cryptoKey = await window.crypto.subtle.importKey(
            'raw', keyData, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
        );

        const signature = await window.crypto.subtle.sign(
            { name: 'HMAC', hash: 'SHA-256' }, cryptoKey, msgData
        );

        let base64Signature = base64UrlEncode(new Uint8Array(signature));
        return base64Signature;
    }

    async main(prompt) {
        const token = await this.generateToken()
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

        let status = await fetch('https://open.bigmodel.cn/api/paas/v3/model-api/chatglm_turbo/async-invoke', {
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
                let response = await fetch('https://open.bigmodel.cn/api/paas/v3/model-api/chatglm_turbo/async-invoke/' + status.data.task_id, {
                    method: 'GET',
                    headers: requestOptions.headers
                });
                data = await response.json();
                attempts++; // 每次请求后增加尝试次数
                // 等待一段时间再发送下一个请求，以避免过于频繁的请求
                await new Promise(resolve => setTimeout(resolve, 500));
            } while ((data.data.task_status !== 'SUCCESS' && data.data.task_status !== 'FAIL') && attempts < maxAttempts);

            // 返回获取到的数据
            return {
                choices: data.data.choices.map(item => {
                    return{
                        message: JSON.parse(`{"role":"${item.role}","content":${item.content}}`)
                    }
                })
            };
        }
    }
}
const buildMessage = (raw) => {
    let { role, content } = raw

    return {
        content: content || '',
        role: role
    }
}
