import { ChatSession } from "./chatSession.js";
let answer = "";

class Ws_Param {
    constructor(APPID, APIKey, APISecret, Spark_url) {
        this.APPID = APPID;
        this.APIKey = APIKey;
        this.APISecret = APISecret;
        this.host = new URL(Spark_url).hostname;
        this.path = new URL(Spark_url).pathname;
        this.Spark_url = Spark_url;
    }

    async create_url() {
        const date = new Date().toGMTString();
        let signature_origin = `host: ${this.host}\ndate: ${date}\nGET ${this.path} HTTP/1.1`;

        const key = await window.crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(this.APISecret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["sign"]
        );
        const signature_sha = await window.crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signature_origin));
        console.log(signature_sha)
        let signature_sha_base64 = btoa(String.fromCharCode(...new Uint8Array(signature_sha)));
        console.log(signature_sha_base64)

        let authorization_origin = `api_key="${this.APIKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature_sha_base64}"`;
        console.log(authorization_origin)

        let authorization = btoa(authorization_origin);

        let url = `${this.Spark_url}?authorization=${authorization}&date=${date}&host=${this.host}`
        return url;
    }
}


function gen_params(appid, domain, question) {
    let data = {
        "header": {
            "app_id": appid,
        },
        "parameter": {
            "chat": {
                "domain": domain,
                "temperature": 0.5,
                "max_tokens": 1024,
            }
        },
        "payload": {
            "message": {
                "text": [
                    { "role": "system", "content": 'use English in your reply' },

                    { "role": "user", "content": question }
                ]
            }
        }
    };
    return data;
}

async function main(appid, api_key, api_secret, Spark_url, domain, question) {
    let wsParam = new Ws_Param(appid, api_key, api_secret, Spark_url);
    let wsUrl = await wsParam.create_url();
    let ws = new WebSocket(wsUrl);
    ws.onerror = function (event) {
        console.error("WebSocket error observed:", event);
    };
    ws.onopen = function open() {
        let data = JSON.stringify(gen_params(appid, domain, question));
        ws.send(data);
    };
    ws.onmessage = (event) => {
        let data = JSON.parse(event.data);
        let code = data['header']['code'];
        if (code != 0) {
            console.log(`请求错误: ${code}, ${JSON.stringify(data)}`);
            ws.close();
        } else {
            let choices = data["payload"]["choices"];
            let status = choices["status"];
            let content = choices["text"][0]["content"];
            console.log(content);
            answer += content;
            if (status == 2) {
                ws.close();
            }
        }
    };
}

// 填入你的参数
let appid = "bdab79f3";
let api_key = "0d9b55df237d72590e01f10013f38dca";
let api_secret = "MWNhYTlhMjM3ZjNiMzA5ZjgyYmZlNjM4";
let Spark_url = "ws://spark-api.xf-yun.com/v2.1/chat";
let domain = "generalv2";
let question = "给我写一首诗";

// 调用main函数
main(appid, api_key, api_secret, Spark_url, domain, question);


export class sparkChat  extends ChatSession{
    constructor(options) {
        super()
        this.options = {
            appid: "bdab79f3",
            api_key: "0d9b55df237d72590e01f10013f38dca",
            api_secret: "MWNhYTlhMjM3ZjNiMzA5ZjgyYmZlNjM4",
            Spark_url: "ws://spark-api.xf-yun.com/v2.1/chat",
            domain: "generalv2",
            question: "给我写一首诗",

        }
    }

}