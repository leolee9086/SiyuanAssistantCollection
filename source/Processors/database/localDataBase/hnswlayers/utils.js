
export const 获取随机层级 = (maxLevel, p = 1 / Math.E) => {
    return Math.floor(-Math.log(Math.random()) / Math.log(1 / p)) % (maxLevel + 1);
}
export function 获取数据项所在hnsw层级(数据项, 模型名称) {
    let hnsw索引名称 = 模型名称 + "_hnsw";
    if (!数据项.neighbors || !Array.isArray(数据项.neighbors[hnsw索引名称])) {
        // 处理错误或返回一个合理的默认值，例如 0 或 -1
        return -1; // 或者抛出一个错误
    }
    let 数据项hnsw邻接表 = 数据项.neighbors[hnsw索引名称];
    return Math.max(数据项hnsw邻接表.length - 1, 0);
}
export function 校验节点邻接结构(数据项, 模型名称) {
    let hnsw索引名称 = 模型名称 + "_hnsw";
    let 邻接表 = 数据项.neighbors[hnsw索引名称];
    if (!邻接表) {
        throw new Error(`数据项缺少 ${hnsw索引名称} 邻接表`);
    }
    // 假设有一个全局配置对象，其中包含每个层级的最大邻居数
    const 最大邻居数配置 = {/* 层级: 最大邻居数 */ };
    for (let 层级 = 0; 层级 < 邻接表.length; 层级++) {
        let 邻居信息 = 邻接表[层级];
        if (!邻居信息 || !Array.isArray(邻居信息.items)) {
            throw new Error(`层级 ${层级} 的邻居信息格式不正确`);
        }

        if (邻居信息.items.length > 最大邻居数配置[层级]) {
            throw new Error(`层级 ${层级} 的邻居数量超过最大限制`);
        }

        if (邻居信息.items.includes(数据项.id)) {
            throw new Error(`层级 ${层级} 的邻居列表中包含数据项自身`);
        }
    }
    // 如果所有检查都通过，则返回 true 表示邻接结构有效
    return true;
}
