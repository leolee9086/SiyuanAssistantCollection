import { sac } from "../../../../asyncModules.js";
import { withPerformanceLogging } from "../../../../utils/functionAndClass/performanceRun.js";
import { hnsw索引元设置 } from "../config.js";
import { 从候选邻居中挑选最终邻居, 根据层级获取节点邻居候选, 链接邻居 } from "../hnswlayers/build.js";
import { hnswAnn搜索数据集 } from "../hnswlayers/query.js";
import { 获取随机层级 } from "../hnswlayers/utils.js";
import { 准备向量查询函数 } from "./query.js";
export const 迁移数据项向量结构 = (数据项, hnsw层级映射) => {
    let 迁移结果 = {
        created: 数据项.created || Date.now(),
        updated: 数据项.updated || Date.now(),
        neighbors: 数据项.neighbors || {},
        meta: {},
        vector: {},
        id: 数据项.id,
    };
    // 如果数据项已经有meta字段，则直接迁移meta
    if (数据项.meta) {
        迁移结果.meta = 数据项.meta;
    } else {
        // 将数据项除了vector之外的所有字段复制到meta中
        for (let key in 数据项) {
            if (数据项.hasOwnProperty(key) && key !== 'vector' && key !== 'created' && key !== 'updated' && key !== 'neighbors' && key !== 'meta') {
                迁移结果.meta[key] = 数据项[key];
            }
        }
    }
    if (Array.isArray(数据项.vector)) {
        console.warn('0.0.1之后,数据项的向量应该是一个字典,数据项将迁移到新的数据结构');
        迁移结果.vector = { 'vector': 数据项.vector };
    }

    初始化数据项向量字段(数据项, 迁移结果);
    添加所有模型到hnsw层级映射(迁移结果, hnsw层级映射)
    return 迁移结果;
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

                    // 将邻接表添加到对应层级的映射中
                    hnsw层级映射[模型名称][邻接表.layer].push(数据项.id);
                });
            } else {
                // 如果数据项没有对应模型名称的邻接表，可能需要记录错误或进行初始化
                初始化hnsw单模型邻接表(模型名称, 数据项)
            }
        }
    }
};
export const 初始化数据项向量字段 = (数据项, 迁移结果) => {
    // 检查数据项是否有vector字段且该字段为对象
    if (数据项.vector && typeof 数据项.vector === 'object') {
        // 遍历vector字段的每个键
        Object.keys(数据项.vector).forEach(key => {
            let vectorValue = 数据项.vector[key];
            // 检查vector字段的每个值是否为有效的向量
            if (Array.isArray(vectorValue) && vectorValue.every(item => typeof item === 'number')) {
                // 如果是有效的数组向量，则使用Float32Array来初始化迁移结果的vector字段
                迁移结果.vector[key] = new Float32Array(vectorValue);
            } else if (typeof vectorValue === 'object' && vectorValue !== null) {
                // 如果vector字段是对象形式的"数组"（键为索引，值为数字）
                let sortedKeys = Object.keys(vectorValue).map(k => parseInt(k)).sort((a, b) => a - b);
                if (sortedKeys.every((k, i) => k === i) && Object.values(vectorValue).every(v => typeof v === 'number')) {
                    // 如果键是连续的整数且值为数字，则将其视为有效向量，并转换为Float32Array
                    迁移结果.vector[key] = new Float32Array(sortedKeys.map(k => vectorValue[k]));
                } else {
                    // 如果不是有效的向量结构，打印警告并设置默认向量
                    console.warn(`数据项的vector字段中的${key}不是有效的向量`);
                    迁移结果.vector[key] = new Float32Array([0, 0]);
                }
            } else {
                // 如果vector字段既不是数组也不是对象形式的"数组"，打印警告并设置默认向量
                console.warn(`数据项的vector字段中的${key}不是有效的向量`);
                迁移结果.vector[key] = new Float32Array([0, 0]);
            }
        });
    }
    // 返回更新后的迁移结果
    return 迁移结果;
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
    if (迁移结果.neighbors && typeof 迁移结果.neighbors === 'object') {
        // 确保已存在数据项的neighbors字段是对象
        if (typeof 已存在数据项.neighbors !== 'object' || 已存在数据项.neighbors === null) {
            已存在数据项.neighbors = {};
        }
        // 遍历迁移结果中的neighbors对象
        for (const [邻接表名称, 邻接表] of Object.entries(迁移结果.neighbors)) {
            // 如果已存在数据项中没有当前模型名称的邻接表，直接赋值
            if (!已存在数据项.neighbors[邻接表名称]) {
                已存在数据项.neighbors[邻接表名称] = 邻接表;
            } else {
                // 如果已存在，合并邻接表
                // 假设邻接表是一个数组，需要合并并去重
                已存在数据项.neighbors[邻接表名称] = Array.from(new Set([...已存在数据项.neighbors[邻接表名称], ...邻接表]));
            }
        }
    }
    return 已存在数据项;
};
//这个函数的作用是去除非存储键值,因此需要改为正确的名称
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
export const 获取数据项向量字段值 = (数据项, 向量字段名) => {
    return 数据项.vector[向量字段名] || [];
};
//有关hnsw索引的初始化技术
export const 获取数据项特定hnsw索引邻接表 = (数据项, hnsw索引名称, 目标层级) => {
    let 层级邻接表 = 数据项.neighbors[hnsw索引名称].find(邻接表 => {
        return 邻接表.layer === 目标层级
    })
    return 层级邻接表
};
export const 初始化hnsw单模型邻接表 = (模型名称, 数据项, 强制重建) => {
    let hnsw索引名称 = 模型名称 + "_hnsw";
    if (!数据项.neighbors[hnsw索引名称]) {
        let 当前层级 = 获取随机层级(hnsw索引元设置.最大层级)

        // 如果还没有为该模型初始化 HNSW 结构，则初始化一个数组，每个元素对应一个层级
        数据项.neighbors[hnsw索引名称] = [];
        //为每一个层级构建邻接表
        for (let i = 0; i <= 当前层级; i++) {
            数据项.neighbors[hnsw索引名称].push({
                layer: i,
                items: [] // 初始化空的邻居列表
            });
        }
    } else if (强制重建) {
        // 如果已经存在 HNSW 结构，确保层级数组是最新的
        let 当前层级 = 获取随机层级(hnsw索引元设置.最大层级)

        let hnsw层级数组 = 数据项.neighbors[hnsw索引名称];

        // 如果当前层级大于数组长度，添加缺失的层级
        for (let i = hnsw层级数组.length; i <= 当前层级; i++) {
            hnsw层级数组.push({
                layer: i,
                items: [] // 初始化空的邻居列表
            });
        }
    }
    sac.logger.databaseInfo(`数据项${数据项.id}的${模型名称}特征索引初始化完成`)
    return 数据项.neighbors[hnsw索引名称]
}

export const 初始化数据项hnsw领域邻接表 = async (数据项, 数据集, hnsw层级映射) => {
    for (let 模型名称 in 数据项.vector) {
        //let 邻接表 = withPerformanceLogging(初始化hnsw单模型邻接表)(模型名称, 数据项);
        let 邻接表 = 数据项.neighbors[`${模型名称}_hnsw`]
        添加所有模型到hnsw层级映射(数据项, hnsw层级映射)
        for (let 层级邻接表 of 邻接表) {
            let 当前层级 = 层级邻接表.layer
            let 候选邻居表 = withPerformanceLogging(根据层级获取节点邻居候选)(数据集, 数据项, 当前层级, 模型名称, hnsw层级映射)
            let 最终邻居表 = withPerformanceLogging(从候选邻居中挑选最终邻居)(数据集, 数据项, 候选邻居表, 当前层级, 模型名称)
            withPerformanceLogging(链接邻居)(数据集, 数据项, 最终邻居表, 模型名称, 当前层级)
        }
        // 如果特征向量名称数组中还没有这个模型名称，则添加进去
        // 假设有一个方法用于初始化特征向量的hnsw层级
        setTimeout(async()=>{
        try {
            console.log(`当前数据集大小${Object.keys(数据集).length}`)
            let hnsw查询结果 = withPerformanceLogging(hnswAnn搜索数据集)(数据集, 模型名称, 数据项.vector[模型名称], 100,hnsw层级映射)
            let 暴力查询 = withPerformanceLogging(准备向量查询函数)(数据集)
            let 暴力查询结果 = await withPerformanceLogging(暴力查询)(模型名称, 数据项.vector[模型名称], 100)
            console.log(hnsw查询结果[0].id, hnsw查询结果[0].score, 暴力查询结果[0].id, 暴力查询结果[0].similarityScore)
        } catch (e) {
            console.error(e.stack)
            throw e
        }
    },500)
    }

}

