import { 使用worker处理数据 } from "./workerHandler.js";
import { plugin } from "../asyncModules.js";
const 向量生成器地址 =`/plugins/SiyuanAssistantCollection/source/vectorStorage/embeddingWorker.js`
const 向量工具设置 = plugin.configurer.get('向量工具设置').$value


export async function 提取文本向量(文本) {
    await 使用worker处理数据(
        向量工具设置,
        向量生成器地址,
        '初始化配置',
        false
    )
    return await 使用worker处理数据(文本, '/plugins/SiyuanAssistantCollection/source/vectorStorage/embeddingWorker.js', '提取向量')
}
export {提取文本向量 as embeddingText}

