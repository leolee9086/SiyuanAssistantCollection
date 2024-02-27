export const Adapter = class XunFeiAdapter {
    init() {
        return this
    }
    models={
        'chat/completions':[
            {
                id:"spark-1.5",
                process:async(inputMessages)=>{
                    const options = {
                        Spark_url:'wss://spark-api.xf-yun.com',
                        domain:'general',
                        api_key:'',
                        app_id:'',
                        host:'',
                        path:''
                    }
                    return await sendMessage2Spark(inputMessages,options)
                }
            }
        ]
    }
}
//使用这样一个函数是为了构建标准的消息对象,避免空消息造成出错
const buildMessage = (raw) => {
    let { role, content } = raw

    return {
        content: content || '',
        role: role
    }
}
const gen_url = async (options) => {
    let { path, Spark_url, api_key, host } = options
    const date = new Date().toGMTString();
    let signature_origin = `host: ${host}\ndate: ${date}\nGET ${path} HTTP/1.1`;

    const key = await window.crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(this.options.api_secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signature_sha = await window.crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signature_origin));
    let signature_sha_base64 = btoa(String.fromCharCode(...new Uint8Array(signature_sha)));
    let authorization_origin = `api_key="${api_key}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature_sha_base64}"`;
    let authorization = btoa(authorization_origin);
    let url = `${Spark_url}?authorization=${authorization}&date=${date}&host=${host}`
    return url
}
const gen_params = (chat, options) => {
    return {
        "header": {
            "app_id": options.appid,
        },
        "parameter": {
            "chat": {
                "domain": options.domain,
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
const sendMessage2Spark = async (messages, options) => {
    let wsUrl = await gen_url(options);
    return new Promise((resolve, reject) => {
        let answer = ''
        let ws = new WebSocket(wsUrl);
        ws.onerror = function (event) {
            reject("WebSocket error observed:", event);
        };
        ws.onopen = function open() {
            let data = JSON.stringify(gen_params(messages));
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
                answer += content;
                if (status == 2) {
                    let data = { choices: [{ message: { role: 'assistant', content: answer } }] }
                    resolve(data)
                    ws.close();
                }
            }
        };
    })
}