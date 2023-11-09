import { plugin } from '../../runtime.js'
export default async (result) => {

    let obj
    let images = []
    try {
        obj = JSON.parse(result.content)
        if (obj.Prompts) {
            obj=obj.Prompts
        }
        if (Array.isArray(obj)) {
            
            for await (let prompt of obj) {
                let image = await text2Image(prompt)
                images = images.concat(image)
            }
        } else {
            images = await text2Image(obj)

        }
    } catch (e) {
        return JSON.parse(JSON.stringify(result))
    }
    if (
        images[0]
    ) {
        result.images = images
        return result
    }
    return JSON.parse(JSON.stringify(result))
}
async function text2Image(obj) {
    // SD的API接口URL
    const url = `${plugin.configurer.get('模型设置', 'stable diffusion', 'apiBaseURL').$value}/v1/txt2img`;

    // 将obj转换为需要的格式
    const data = {
        prompt: obj.Prompt,
        negativePrompt: obj["Negative prompt"],
        'seed': obj.Seed || 1234,
        'steps': 20,
        'width': 512,
        'height': 512,
        'cfg_scale': 8
    };

    // 发送请求
    const response = await fetch(url, {
        method: 'POST', // 或者 'GET'
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    // 获取返回的图片
    const images = await response.json();
    const URLs = []
    let fs = (await import('../../runtime.js')).fs

    for (let image of images.images) {
        let base64String = image; // 你的Base64字符串
        let fetchResponse = await fetch('data:image/png;base64,' + base64String);
        let blob = await fetchResponse.blob();
        let ID = Lute.NewNodeID()
        let file = new File([blob], ID + '.png', { type: "image/png" });
        //import { fs } from "../../runtime.js"
        await fs.writeFile('/data/public/SacImages/' + ID + '.png', file)
        URLs.push("/public/SacImages/" + ID + '.png')
    }
    return URLs
}