import { hnsw索引元设置 } from "../config.js";


export const 选择入口点 = (数据集, 模型名称, hnsw层级映射, 已遍历入口点) => {
    let hnsw索引名称 = `${模型名称}_hnsw`;
    let 目标层级 = hnsw索引元设置.最大层级 - 1;

    // 利用hnsw层级映射来加速查找过程
    while (目标层级 >= 0) {
        if (hnsw层级映射[模型名称][目标层级] && hnsw层级映射[模型名称][目标层级].length > 0) {
            // 使用映射中存储的id来直接访问数据项
            for (let id of hnsw层级映射[模型名称][目标层级]) {
                if (!已遍历入口点.has(id) || !已遍历入口点) {
                    let 数据项 = 数据集[id];
                    if (数据项 && 数据项.neighbors[hnsw索引名称] && 数据项.neighbors[hnsw索引名称].length > 目标层级) {
                        return 数据项; // 返回第一个找到的候选点
                    }
                }

            }
        }
        目标层级--;
    }
    // 如果所有层级都没有点，则返回null
    return null;
};
