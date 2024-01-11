export const 迁移数据项向量结构 = (数据项) => {
    let 迁移结果 = {
        created: Date.now(),
        updated: Date.now(),
        neighbors: [],
        meta: {},
        vector: {},
        id: 数据项.id
    };
    // 如果数据项已经有meta字段，则直接迁移meta
    if (数据项.meta) {
        迁移结果.meta = 数据项.meta;
    } else {
        // 将数据项除了vector之外的所有字段复制到meta中
        for (let key in 数据项) {
            if (数据项.hasOwnProperty(key) && key !== 'vector') {
                迁移结果.meta[key] = 数据项[key];
            }
        }
    }
    if (Array.isArray(数据项.vector)) {
        console.warn('0.0.1之后,数据项的向量应该是一个字典,数据项将迁移到新的数据结构');
        迁移结果.vector = { 'vector': 数据项.vector };
    }
    初始化数据项向量字段(数据项, 迁移结果);
    return 迁移结果;
};
export const 初始化数据项向量字段 = (数据项, 迁移结果) => {
    if (数据项.vector) {
        Object.keys(数据项.vector).forEach(key => {
            if (!Array.isArray(数据项.vector[key]) || 数据项.vector[key].some(v => typeof v !== 'number')) {
                console.warn(`数据项的vector字段中的${key}不是有效的向量`);
                // 初始化或修正该项为有效向量，这里假设向量是二维的，仅作为示例
                迁移结果.vector[key] = [0, 0]; // 或者其他逻辑来初始化向量
            } else {
                //正常情况下直接复制向量
                迁移结果.vector[key] = 数据项.vector[key]
            }
        });
    }
    return 迁移结果
}
export const 合并已存在数据项 = (已存在数据项, 迁移结果) => {
    // 更新已存在数据项的更新时间
    已存在数据项.updated = Date.now();
    // 合并向量数据
    if (迁移结果.vector) {
        已存在数据项.vector = { ...已存在数据项.vector, ...迁移结果.vector };
    }
    // 合并元数据
    已存在数据项.meta = { ...已存在数据项.meta, ...迁移结果.meta };

    // 合并邻居数据
    if (迁移结果.neighbors && Array.isArray(迁移结果.neighbors)) {
        // 确保已存在数据项的neighbors字段是数组
        if (!Array.isArray(已存在数据项.neighbors)) {
            已存在数据项.neighbors = [];
        }
        // 合并数组，去除重复项
        已存在数据项.neighbors = Array.from(new Set([...已存在数据项.neighbors, ...迁移结果.neighbors]));
    }
    return 已存在数据项;
};

export const 去除特殊键值 = (数据项) => {
    Object.keys(数据项).forEach((key) => {
        if (key.startsWith('$') || typeof 数据项[key] === 'function') {
            delete 数据项[key];
        } else if (typeof 数据项[key] === 'object' && 数据项[key] !== null) {
            去除特殊键值(数据项[key]);
        }
    });
    return 数据项;
};
export const 对分片执行去除特殊键值 = (分片) => {
    if (Array.isArray(分片)) {
        // 如果分片是数组，对每个元素执行去除特殊键值
        return 分片.map(数据项 => 去除特殊键值(数据项));
    } else {
        // 如果分片是对象，对每个键值执行去除特殊键值
        Object.keys(分片).forEach(key => {
            分片[key] = 去除特殊键值(分片[key]);
        });
        return 分片;
    }
};