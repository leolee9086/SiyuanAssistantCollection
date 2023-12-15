import { importWorker } from "../../../../utils/webworker/workerHandler.js"
let embeddingWorkerModule = importWorker(import.meta.resolve('./embeddingWorker.js'))
export const 使用transformersjs生成嵌入=async(模型名称)=>{
    await embeddingWorkerModule.准备管线.$batch(模型名称)
    return (text)=>{
        return embeddingWorkerModule.提取向量(text,499)
    }
}