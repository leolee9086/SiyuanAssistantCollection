import { importWorker } from "../webworker/workerHandler.js";

const WebWorker=importWorker(import.meta.resolve('./similarity.js'))
export const 使用worker计算余弦相似度 = async(vec1,vec2)=>{
    console.log(vec1,vec2)
    let data =await WebWorker.计算余弦相似度32位(vec1,vec2)
    console.log(data)
    return data
}