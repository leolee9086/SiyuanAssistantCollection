import { sac } from "../../../../asyncModules.js";
import { withPerformanceLogging } from "../../../../utils/functionAndClass/performanceRun.js";
import { hnsw索引元设置 } from "../config.js";
import { 为数据项构建hnsw索引, 删除数据项hnsw索引 } from "../hnswlayers/build.js";
import { hnswAnn搜索数据集 } from "../hnswlayers/query.js";
import { 获取随机层级 } from "../hnswlayers/utils.js";
import { 准备向量查询函数 } from "./query.js";
import { 创建邻接表, 查询邻居 } from "../neighbors/crud.js";
import { 添加所有模型到hnsw层级映射 } from "../hnswlayers/utils.js";
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
export const 初始化数据项向量字段 = (数据项, 迁移结果) => {
    // 检查数据项是否有vector字段且该字段为对象
    if (数据项.vector && typeof 数据项.vector === 'object') {
        // 遍历vector字段的每个键
        Object.keys(数据项.vector).forEach(key => {
            let vectorValue = 数据项.vector[key];
            // 检查vector字段的每个值是否为有效的向量
            if (Array.isArray(vectorValue) && vectorValue.every(item => typeof item === 'number')) {
                // 如果是有效的数组向量，则使用Float32Array来初始化迁移结果的vector字段
                迁移结果.vector[key] = new Float32Array(vectorValue)
                初始化hnsw单模型邻接表(key, 迁移结果)
            } else if (typeof vectorValue === 'object' && vectorValue !== null) {
                // 如果vector字段是对象形式的"数组"（键为索引，值为数字）
                let sortedKeys = Object.keys(vectorValue).map(k => parseInt(k)).sort((a, b) => a - b);
                if (sortedKeys.every((k, i) => k === i) && Object.values(vectorValue).every(v => typeof v === 'number')) {
                    // 如果键是连续的整数且值为数字，则将其视为有效向量，并转换为Float32Array
                    迁移结果.vector[key] = new Float32Array(sortedKeys.map(k => vectorValue[k]));
                    初始化hnsw单模型邻接表(key, 迁移结果)
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
    let 层级类型名 = `layer${目标层级}`
    return 查询邻居(数据项, hnsw索引名称, 层级类型名)

};
export const 初始化hnsw单模型邻接表 = (模型名称, 数据项) => {
    let hnsw索引名称 = `${模型名称}_hnsw`;
    if (获取数据项特定hnsw索引邻接表(数据项, hnsw索引名称, 0)) {
        return 数据项.neighbors[hnsw索引名称];
    }
    let 当前层级 = 获取随机层级(hnsw索引元设置.最大层级);
    let 层级列表 = Array.from({ length: 当前层级 + 1 }, (_, index) => `layer${index}`);
    // 使用创建邻接表函数初始化每个层级的邻接表
    创建邻接表(数据项, hnsw索引名称, 层级列表);
    // 确保每个层级的邻接表都已经初始化并且包含items数组
    数据项.neighbors[hnsw索引名称].forEach(层级邻接表 => {
        if (!层级邻接表.items) {
            层级邻接表.items = []; // 初始化空的邻居列表
        }
        if (typeof 层级邻接表.type === 'string') {
            let layerMatch = 层级邻接表.type.match(/layer(\d+)/);
            层级邻接表.layer = layerMatch ? parseInt(layerMatch[1], 10) : undefined;
        }
    });
    sac.logger.databaseInfo(`数据项${数据项.id}的${模型名称}特征索引初始化完成`);
    return 数据项.neighbors[hnsw索引名称];
}
//只有新添加的数据项才需要经过这一步'
let 计算次数=0
let 正确次数=0
function areVectorsEqual(vectorA, vectorB) {
    if (vectorA.length !== vectorB.length) return false;
    for (let i = 0; i < vectorA.length; i++) {
        if (vectorA[i] !== vectorB[i]) return false;
    }
    return true;
}
export const 初始化数据项hnsw领域邻接表 = async (数据项, 数据集, hnsw层级映射,旧数据项) => {
    for (let 模型名称 in 数据项.vector) {
        if (旧数据项 && 旧数据项.vector[模型名称] && !areVectorsEqual(旧数据项.vector[模型名称], 数据项.vector[模型名称])) {
            删除数据项hnsw索引(数据集, 旧数据项.id, 模型名称, hnsw层级映射);
        }
        添加所有模型到hnsw层级映射(数据项, hnsw层级映射)
        为数据项构建hnsw索引(数据集,数据项,模型名称,hnsw层级映射)
        // 如果特征向量名称数组中还没有这个模型名称，则添加进去
        // 假设有一个方法用于初始化特征向量的hnsw层级
       /* try {
            if(Object.keys(数据集).length < 1000){
                continue;
            }
            console.log(`当前数据集大小${Object.keys(数据集).length}`);
            let hnsw查询结果 = withPerformanceLogging(hnswAnn搜索数据集)(数据集, 模型名称, 数据项.vector[模型名称], 100, hnsw层级映射);
            let 暴力查询 = withPerformanceLogging(准备向量查询函数)(数据集);
            let 暴力查询结果 = await withPerformanceLogging(暴力查询)(模型名称, 数据项.vector[模型名称], 100);

            // 计算不同K值的召回率
            const K值列表 = [100, 50, 20,10];
            K值列表.forEach(K值 => {
                let hnswIds = new Set(hnsw查询结果.slice(0, K值).map(r => r.id));
                let 暴力查询Ids = new Set(暴力查询结果.slice(0, K值).map(r => r.id));
                let 交集数量 = [...hnswIds].filter(id => 暴力查询Ids.has(id)).length;
                let 召回率 = 交集数量 / K值; // 召回率是交集数量除以K值
                console.log(`K${K值}的hnswAnn搜索召回率: ${召回率.toFixed(4)}`); // 保留四位小数
            });
            计算次数+=1
            if(hnsw查询结果[0].id===暴力查询结果[0].id){
                正确次数+=1
                console.log(`k1的多次命中召回率: ${(正确次数/计算次数).toFixed(4)}`); // 保留四位小数

            }
            // 显示前一百项的id和分数
            //console.log('hnsw查询结果前100项:', hnsw查询结果.slice(0, 100).map(r => `${r.id}: ${r.score}`));
            //console.log('暴力查询结果前100项:', 暴力查询结果.slice(0, 100).map(r => `${r.id}: ${r.similarityScore}`));
        } catch (e) {
            console.error(e.stack);
            throw e;
        }*/

    }
}

