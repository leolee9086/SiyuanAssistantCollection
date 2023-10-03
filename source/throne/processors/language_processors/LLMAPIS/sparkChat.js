import { ChatSession } from "./chatSession.js";
// 填入你的参数
import { plugin } from "../../../../asyncModules.js";
let 模型设置 = plugin.configurer.get('模型设置','SPARK').$value
export class sparkChat extends ChatSession {
    constructor(options) {
        super()

        this.options = {
            ...模型设置,
            ...options
        }
        this.host = new URL(this.options.Spark_url).hostname;
        this.path = new URL(this.options.Spark_url).pathname;

    }
    async send(userMessage) {
        const post = userMessage.map(
            item => {
                return buildMessage(item)
            }
        )
        let data =await this.main(post)
        return data
    }
    async gen_url() {
        if (!this.url) {
            const date = new Date().toGMTString();
            let signature_origin = `host: ${this.host}\ndate: ${date}\nGET ${this.path} HTTP/1.1`;

            const key = await window.crypto.subtle.importKey(
                "raw",
                new TextEncoder().encode(this.options.api_secret),
                { name: "HMAC", hash: "SHA-256" },
                false,
                ["sign"]
            );
            const signature_sha = await window.crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signature_origin));
            let signature_sha_base64 = btoa(String.fromCharCode(...new Uint8Array(signature_sha)));
            let authorization_origin = `api_key="${this.options.api_key}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature_sha_base64}"`;
            let authorization = btoa(authorization_origin);
            let url = `${this.options.Spark_url}?authorization=${authorization}&date=${date}&host=${this.host}`
            this.url = url;
            return this.url
        }
    }
    gen_params(chat) {
        return {
            "header": {
                "app_id": this.options.appid,
            },
            "parameter": {
                "chat": {
                    "domain": this.options.domain,
                    "temperature": 0.5,
                    "max_tokens": 1024,
                }
            },
            "payload": {
                "message": {
                    "text": chat
                }
            }
        };
    }
    async main(chat) {
        let wsUrl = await this.gen_url();
        let that = this
        return new Promise((resolve, reject) => {
            console.log(chat)
            let answer =''
            let ws = new WebSocket(wsUrl);
            ws.onerror = function (event) {
                reject("WebSocket error observed:", event);
            };
            ws.onopen = function open() {
                let data = JSON.stringify(that.gen_params(chat));
                ws.send(data);
            };
            ws.onmessage = (event) => {
                let data = JSON.parse(event.data);
                let code = data['header']['code'];
                if (code != 0) {
                    reject(`请求错误: ${code}, ${JSON.stringify(data)}`);
                    ws.close();
                } else {
                    let choices = data["payload"]["choices"];
                    let status = choices["status"];
                    let content = choices["text"][0]["content"];
                    console.log(content);
                    answer += content;
                    if (status == 2) {
                        console.log(answer)
                        let data= {choices:[{message:{role:'assistant',content:answer}}]}
                        resolve(data)
                        ws.close();
                    }
                }
            };

        })
    }
}

//使用这样一个函数是为了构建标准的消息对象,避免空消息造成出错
const buildMessage = (raw) => {
    let { role, content } = raw
    if (!role) {
        role = 'system'
    } else {
        if (!([ 'user', 'assistant'].includes(role))) {
            content = `${role}:` + content
            role = 'user'
        }
    }
    return {
        content: content || '',
        role: role
    }
}
