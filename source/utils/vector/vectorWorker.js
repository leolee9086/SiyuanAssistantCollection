import { importWorker } from "../webworker/workerHandler.js";

const WebWorker=importWorker(import.meta.resolve('./similarity.js'))
const KnnWorker=importWorker(import.meta.resolve('./knn.js'))

export const 使用worker计算余弦相似度 = async(vec1,vec2)=>{
    let data =await WebWorker.计算余弦相似度32位(vec1,vec2)
    return data
}
export const 使用worker查找K最近邻= async(点数据集,目标向量,查找阈值)=>{
    let data =await KnnWorker.查找K最近邻(点数据集,目标向量,查找阈值)
    
    return data
}