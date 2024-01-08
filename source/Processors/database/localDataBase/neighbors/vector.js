// 假设 cosineSimilarity 函数已经实现，并且可以计算两个二维向量之间的余弦相似度
// 假设 相似度阈值 是你设定的相似度阈值
import { 计算余弦相似度 } from "../vector.js";
const 数据集 = { /* ...数据集... */ };
const 相似度阈值 = 0.8
const 生成器 = 更新数据项余弦相似邻接项生成器(数据集, 相似度阈值);

function* 更新数据项余弦相似邻接项生成器(数据集, 相似度阈值) {
    for (const 项目键 in 数据集) {
        if (是否已处理(数据集, 项目键)) {
            const 项目 = 数据集[项目键];
            数据集[项目键].已处理 = true; // 标记当前项目已处理
            更新邻接项(数据集, 项目, 项目键, 相似度阈值);
            yield 项目键; // 暂停执行，直到下一次调用
        }
    }
    清除已处理标记(数据集);
}
function 是否已处理(数据集, 项目键) {
    return 数据集.hasOwnProperty(项目键) && !数据集[项目键].已处理;
}
function 更新邻接项(数据集, 项目, 项目键, 相似度阈值) {
    const 邻接项数组 = [];
    for (const 其他键 in 数据集) {
        if (数据集.hasOwnProperty(其他键) && 其他键 !== 项目键 && !数据集[其他键].已处理) {
            const 其他项目 = 数据集[其他键];
            if (检查并更新相似度(数据集, 项目, 其他项目, 项目键, 其他键, 邻接项数组, 相似度阈值)) {
                break;
            }
        }
    }
    数据集[项目键].neighbors.cosineSimilarity = 邻接项数组;
}
function 更新对称邻接项(数据集, 项目键, 其他键) {
    if (!数据集[其他键].neighbors.cosineSimilarity.includes(项目键)) {
        数据集[其他键].neighbors.cosineSimilarity.push(项目键);
    }
}
function 检查并更新相似度(数据集, 项目, 其他项目, 项目键, 其他键, 邻接项数组, 相似度阈值) {
    for (const 向量键 in 项目.vector) {
        if (其他项目.vector.hasOwnProperty(向量键)) {
            const 相似度 = 计算余弦相似度(项目.vector[向量键], 其他项目.vector[向量键]);
            if (相似度 > 相似度阈值) {
                邻接项数组.push(其他键);
                更新对称邻接项(数据集, 项目键, 其他键);
                return true;
            }
        }
    }
    return false;
}
// 在闲时调用
function 处理下一步() {
    const 结果 = 生成器.next();
    if (!结果.done) {
        // 处理了一个项目，可以在这里进行更新UI或其他操作
        // 然后在下一个闲时继续处理
        requestIdleCallback(处理下一步);
    } else {
        // 所有项目处理完毕
    }
}
// 开始处理
requestIdleCallback(处理下一步);
