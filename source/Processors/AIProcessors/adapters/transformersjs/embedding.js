import { importWorker } from "../../../../utils/webworker/workerHandler.js"
let embeddingWorkerModule = importWorker(import.meta.resolve('./embeddingWorker.js'))
let vectorCache = {

}
export const 使用transformersjs生成嵌入 = async (模型名称) => {
    if(!vectorCache[模型名称]){
        vectorCache[模型名称]={}
    }
    return async (text) => {
        if(vectorCache[模型名称][text]){
            return vectorCache[模型名称][text]
        }
        await embeddingWorkerModule.准备管线.$batch(模型名称);
        if (Array.isArray(text)) {
            let data= embeddingWorkerModule.批量提取向量(text, 499);
            return data
        } else {
            
            let data = embeddingWorkerModule.提取向量(text, 499);
            vectorCache[text]=data
            return data
        }
    };
};