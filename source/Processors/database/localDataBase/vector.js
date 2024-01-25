import { 计算余弦相似度,计算归一化向量余弦相似度 } from "../../../utils/vector/similarity.js";
import { 使用worker查找K最近邻, 使用worker计算余弦相似度 } from "../../../utils/vector/vectorWorker.js";
import { GPU } from "../../../../static/gpu.js";
import { withPerformanceLogging } from "../../../utils/functionAndClass/performanceRun.js";
export async function 创建简单短哈希(文本,短码长度=8) {
    const 编码器 = new TextEncoder();
    const 编码结果 = 编码器.encode(文本);
    const hashBuffer = await crypto.subtle.digest('SHA-256', 编码结果);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const 哈希值 = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    const 短哈希值 = 哈希值.substring(0, 短码长度);
    return 短哈希值;
}
export const 计算向量相似度=(输入点, 点数据集, 相似度算法)=>{
    let 拷贝点
    if (!Array.isArray(输入点)) {
        拷贝点 = JSON.parse(输入点)
    } else {
        拷贝点 = 输入点
    }
    let similarityScores = [];
    for (let v of 点数据集) {
        let similarity = 相似度算法(拷贝点, v.vector);
        similarityScores.push({
            data: v,
            score: similarity
        });
    }
    return similarityScores;
}
export async function _查找最相似点(输入点, 点数据集, 查找阈值 = 10, 相似度算法=计算余弦相似度32位, 过滤条件) {
    let 拷贝点 = Array.isArray(输入点) ? 输入点 : JSON.parse(输入点);
    let tops = new Array(查找阈值).fill(null).map(() => ({ score: -Infinity }));
    let minScore = -Infinity;

    for (let v of 点数据集) {
        if (过滤条件 && !过滤条件(v)) continue;
        let similarity = 相似度算法(拷贝点, v.vector);
        if (similarity > minScore) {
            tops.push({ data: v, score: similarity });
            tops.sort((a, b) => b.score - a.score);
            tops.length = 查找阈值;
            minScore = tops[tops.length - 1].score;
        }
    }
    return tops.filter(t => t !== null);
}

export async function 查找最相似点(输入点, 点数据集, 查找阈值 = 10, 相似度算法=计算归一化向量余弦相似度, 过滤条件) {
    let 拷贝点 = new Float32Array(输入点)
    let tops = [];
    for (let v of 点数据集) {
        if (过滤条件 && !过滤条件(v)) continue;
        let similarity =await 相似度算法(拷贝点, v.vector);
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

/*export function 查找最相似点(输入点, 点数据集, 查找阈值 = 10, 相似度算法=计算余弦相似度, 过滤条件) {
    let 拷贝点
    if (!Array.isArray(输入点)) {
        拷贝点 = JSON.parse(输入点)
    } else {
        拷贝点 = 输入点
    }
    let similarityScores = [];
    for (let v of 点数据集) {
        let similarity = 相似度算法(拷贝点, v.vector);
        similarityScores.push({
            data: v,
            score: similarity
        });
    }
    //前置过滤得了
    if (过滤条件) {
        similarityScores = similarityScores.filter(i => {
            return 过滤条件(i)
        })
    }
    similarityScores.sort((a, b) => b.score - a.score);
    let tops = similarityScores.slice(0, 查找阈值)
    return tops;
}*/
export {查找最相似点 as findSimilarity}