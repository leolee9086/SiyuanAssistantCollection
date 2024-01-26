
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
export const 重建数据集的层级映射 = (数据集, hnsw层级映射,id) => {
    // 清空当前的层级映射
    console.warn("hnsw层级映射错误,正在重建")
    if(id){
        添加所有模型到hnsw层级映射(数据集[id],hnsw层级映射)
        return
    }
    // 遍历数据集中的每一项数据项
    Object.values(数据集).forEach(数据项 => {
        // 为每个数据项添加到层级映射中
        setTimeout(()=>{添加所有模型到hnsw层级映射(数据项, hnsw层级映射)});
    });
};
export const 添加所有模型到hnsw层级映射 = (数据项, hnsw层级映射) => {
    // 遍历数据项的vector字段中的每个模型名称
    for (let 模型名称 in 数据项.vector) {
        if (数据项.vector.hasOwnProperty(模型名称)) {
            // 获取hnsw索引名称
            let hnsw索引名称 = `${模型名称}_hnsw`;
            // 检查数据项是否有对应模型名称的邻接表
            if (数据项.neighbors && 数据项.neighbors[hnsw索引名称]) {
                // 确保hnsw层级映射为该模型名称初始化了一个数组
                if (!hnsw层级映射[模型名称]) {
                    hnsw层级映射[模型名称] = [];
                }
                // 遍历数据项的邻接表，按层级添加到hnsw层级映射中
                数据项.neighbors[hnsw索引名称].forEach((邻接表) => {
                    // 确保hnsw层级映射在该层级有一个数组来存储邻接表
                    if (!hnsw层级映射[模型名称][邻接表.layer]) {
                        hnsw层级映射[模型名称][邻接表.layer] = [];
                    }
                    hnsw层级映射[模型名称][邻接表.layer].push(数据项.id);
                });
                // 校验并清除不存在的邻接表映射
                hnsw层级映射[模型名称].forEach((层级, index) => {
                    if (!数据项.neighbors[hnsw索引名称].some(邻接表 => 邻接表.layer === index)) {
                        // 如果数据项没有当前层级的邻接表，但映射表中有记录，则清除该层级的映射
                        hnsw层级映射[模型名称][index] = hnsw层级映射[模型名称][index].filter(id => id !== 数据项.id);
                    }
                });
            }
        }
    }
};
