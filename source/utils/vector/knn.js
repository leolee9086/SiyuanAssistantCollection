import { 计算余弦相似度32位 } from "./similarity.js";

export async function 查找K最近邻(点数据集,目标向量,查找阈值){
    let tops=[]
    for (let v of 点数据集) {
        let similarity =await 计算余弦相似度32位(目标向量, v.vector);
        if (tops.length < 查找阈值 || similarity > tops[tops.length - 1].score) {
            tops.push({ data: v, score: similarity });
            tops.sort((a, b) => b.score - a.score);
            if (tops.length > 查找阈值) {
                tops.pop();
            }
        }
    }
    return tops;

}