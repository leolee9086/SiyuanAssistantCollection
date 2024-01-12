import fs from "../../polyfills/fs.js";
//这个文件的作用是在webworker进程中获取思源的配置
globalThis.siyuan={}
globalThis.siyuan.config =JSON.parse(await fs.readFile('/conf/conf.json'))
if(await fs.exists('/data/storage/petal/SiyuanAssistantCollection/模型设置.json')){
    globalThis.modelSetting =JSON.parse(await fs.readFile('/data/storage/petal/SiyuanAssistantCollection/模型设置.json'))
    console.log(globalThis.modelSetting)
}
