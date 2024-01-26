import { 计算归一化向量余弦相似度 } from "../../../../utils/vector/similarity.js";
import { hnsw索引元设置 } from "../config.js";
import { 获取数据项向量字段值, 获取数据项特定hnsw索引邻接表 } from "../utils/item.js";
import { 获取数据项所在hnsw层级 } from "./utils.js";
import { MinHeap } from "../../../../utils/Array/minHeap.js";
import { 选择入口点 } from "./entry.js";
function 贪心搜索当前层级(数据集, 当前点, 查询向量, hnsw索引名称, 当前层级, 模型名称, 已遍历点=new Set()) {
    let 最近点 = 当前点;
    let 最近点特征向量 = 获取数据项向量字段值(数据集[最近点.id], 模型名称);
    let 最近距离 = 1 - 计算归一化向量余弦相似度(查询向量, 最近点特征向量);
    let 改进 = true;
    //持续搜索直到找到最近的点
    while (改进) {
        改进 = false;
        let 当前层邻接表 = 获取数据项特定hnsw索引邻接表(最近点, hnsw索引名称, 当前层级);
        for (let 邻居 of 当前层邻接表.items) {
            if (!已遍历点.has(邻居.id)) {
                已遍历点.add(邻居.id);
                if (数据集[邻居.id]) {
                    let 邻居特征向量 = 获取数据项向量字段值(数据集[邻居.id], 模型名称);
                    let 邻居距离 = 1 - 计算归一化向量余弦相似度(查询向量, 邻居特征向量);
                    if (邻居距离 < 最近距离) {
                        最近点 = 数据集[邻居.id];
                        最近距离 = 邻居距离;
                        改进 = true;
                        // 更新当前层邻接表为新的最近点的邻接表
                        当前层邻接表 = 获取数据项特定hnsw索引邻接表(最近点, hnsw索引名称, 当前层级);
                        // 重置循环以遍历新的最近点的邻居
                        break;
                    }
                }
            }
        }
    }
    return { data: 最近点, distance: 最近距离 };
}
function hnswAnn单次搜索(数据集, 模型名称, 查询向量, N = 1, hnsw层级映射, 入口点, 已遍历点=new Set()) {
    // ...其他代码保持不变...
    入口点 = 入口点 || 选择入口点(数据集, 模型名称, hnsw层级映射,已遍历点);
    if (!入口点) {
        // 如果没有找到入口点，可能需要处理错误或返回空结果
        return null;
    }
    let hnsw索引名称 = `${模型名称}_hnsw`;
    let 目标层级 = 获取数据项所在hnsw层级(入口点, 模型名称);
    let 当前层级 = 目标层级
    // 从最高层开始贪心搜索，直到最底层
    let 当前点 = 入口点;
    let 当前向量 = 获取数据项向量字段值(当前点,模型名称)
    let 当前距离 = 1-计算归一化向量余弦相似度(查询向量,当前向量);
    //最小堆,用于决定下一个检查的节点
    let 优先队列 = new MinHeap((a, b) => a.distance - b.distance);
    //最大堆,用于存储结果
    let 结果队列 = new MinHeap((a, b) => b.distance - a.distance)
    //逐层下降到零层
    for (; 当前层级 > 0; 当前层级--) {
        let 贪心搜索当前层级结果 = 贪心搜索当前层级(数据集, 当前点, 查询向量, hnsw索引名称, 当前层级, 模型名称);
        当前距离 = 贪心搜索当前层级结果.distance
        当前点 = 贪心搜索当前层级结果.data
    }
    //下降到零层之后
    //避免重复访问
    //在0层遍历时,避免原地转圈
    //结果点集是一个最小堆
    结果队列.push({ data: 当前点, distance: 当前距离 })
    优先队列.push({ data: 当前点, distance: 当前距离 })
    已遍历点.add(当前点.id)
    let 当前层邻接表 = 获取数据项特定hnsw索引邻接表(当前点, hnsw索引名称, 当前层级);
    //优先队列是一个最小堆,它还有元素的时候说明没有检查完
    while (优先队列.size() > 0) {
        //这是当前最近的点
        let { data: 当前参考点, distance: 当前参考距离 } = 优先队列.pop();
        //如果当前最近点的距离,比结果中最远点的距离要大,而且结果队列满了的话
        if (当前参考距离 > 当前距离&&结果队列.size>=N) {
            break
        }
        当前距离 = 当前参考距离
        当前层邻接表 = 获取数据项特定hnsw索引邻接表(当前参考点, hnsw索引名称, 当前层级);
        for (let 邻居 of 当前层邻接表.items) {
            if (!已遍历点.has(邻居.id)) {
                已遍历点.add(邻居.id)
                if (数据集[邻居.id]) {
                    let 邻居特征向量 = 获取数据项向量字段值(数据集[邻居.id], 模型名称);
                    let 邻居距离 = 1 - 计算归一化向量余弦相似度(查询向量, 邻居特征向量);
                    if (结果队列.size() < N || 邻居距离 < 当前距离) {
                        优先队列.push({ data: 数据集[邻居.id], distance: 邻居距离 });
                        结果队列.push({ data: 数据集[邻居.id], distance: 邻居距离 });
                        //压入新的点之后检查结果队列是不是满了
                        if (结果队列.size()>N) {
                            //弹出最远的结果点,并且更新参考距离
                            当前距离= 结果队列.pop().distance
                        }
                    }
                }
            }
        }
    }

    let 结果 = [];
    while (结果.length < N && 结果队列.size() > 0) {
        let heapItem = 结果队列.pop();
        let item = { ...heapItem.data, score: 1 - heapItem.distance }; // 克隆data并转换分数为相似度
        结果.push(item);
    }
    //结果队列是一个最大堆,所以需要反转
    return 结果.reverse();
}

export function hnswAnn搜索数据集(数据集, 模型名称, 查询向量, N = 1, hnsw层级映射) {
    let 结果集 = new Map();
    let 已遍历入口点 = new Set();
    let 遍历次数 = 0
    //采用多次检索,直到没有入口点可供遍历
    let 实际候选数量 = Math.ceil(Math.max(N * 1.5, hnsw索引元设置.搜索过程动态候选数量));    
    //进行两次无放回的检索减少随机性
    while (结果集.size < N||遍历次数<3 ) {
        let 入口点 = 选择入口点(数据集, 模型名称, hnsw层级映射, 已遍历入口点);
        if (!入口点) {
            break;
        }
        已遍历入口点.add(入口点.id);
        let 搜索结果 = hnswAnn单次搜索(数据集, 模型名称, 查询向量, 实际候选数量-结果集.size, hnsw层级映射, 入口点);
        if (搜索结果) {
            搜索结果.forEach(item => {
                结果集.set(item.id, item);
            });
        }
        遍历次数++
    }
    // 将Map的值转换为数组，根据distance排序，并根据需要的数量截取
    let 结果数组 = Array.from(结果集.values());
    结果数组.sort((a, b) => b.score - a.score);
    // 结构化克隆结果数组以确保返回全新的对象数组
    return structuredClone(结果数组.slice(0, N));
}
