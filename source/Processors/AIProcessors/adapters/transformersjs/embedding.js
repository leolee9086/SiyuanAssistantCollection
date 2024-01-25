import { sac } from "../../../../asyncModules.js";
import { importWorker } from "../../../../utils/webworker/workerHandler.js"
let embeddingWorkerModule = importWorker(import.meta.resolve('./embeddingWorker.js'))
let vectorCache = {

}
export const 使用transformersjs生成嵌入 = async (模型名称, 最大缓存大小 = 100) => {
    if (!vectorCache[模型名称]) {
        vectorCache[模型名称] = {}
    }
    await embeddingWorkerModule.准备管线.$batch(模型名称);
    sac.logger.localEmbeddingInfo(`管线准备完毕${模型名称}可用`)
    return async (text) => {
        if (vectorCache[模型名称][text]) {
            return vectorCache[模型名称][text]
        }
        if (Array.isArray(text)) {
            let data = await embeddingWorkerModule.批量提取向量(text, 499);
            return data
        } else {
            let data = await embeddingWorkerModule.提取向量(text, 499);
            if (data.data) {
                vectorCache[模型名称][text] = data;
            }
            // 检查缓存大小并在必要时清理
            if (Object.keys(vectorCache[模型名称]).length > 最大缓存大小) {
                vectorCache[模型名称] = {}; // 清空模型名称下的缓存
            }
            return data;
        }
    };
};