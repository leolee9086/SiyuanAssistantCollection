import { 最小堆 } from "../../../../utils/Array/minHeap.js";
import { withPerformanceLogging } from "../../../../utils/functionAndClass/performanceRun.js";
import { hnsw索引元设置, 计算层级预期邻居数量 } from "../config.js";
import { 计算数据项距离 } from "../utils/distance.js";
import { 获取数据项特定hnsw索引邻接表 } from "../utils/item.js";

export function 根据层级获取节点邻居候选(数据集, 目标数据项, 目标层级, 模型名称, hnsw层级映射) {
    let hnsw索引名称 = `${模型名称}_hnsw`;
    let 节点访问记录 = new Set();
    节点访问记录.add(目标数据项.id);
    let 构建过程动态候选数量 = hnsw索引元设置.构建过程动态候选数量;

    // 使用最小堆来维护候选邻居列表
    let 候选邻居堆 = new 最小堆((a, b) => b.distance - a.distance);

    // 直接从层级映射获取目标层级的所有节点
    let 目标层级节点 = hnsw层级映射[模型名称] && hnsw层级映射[模型名称][目标层级] ? hnsw层级映射[模型名称][目标层级] : [];

    // 遍历目标层级的节点

        for (const id of 目标层级节点) {
            let 数据项 = 数据集[id];
            // 检查数据项是否存在
            if (数据项 && !节点访问记录.has(id)) {
                节点访问记录.add(id);
                let distance = 计算数据项距离(数据项, 目标数据项, 模型名称);
                // 添加到堆中
                候选邻居堆.push({ id, distance });
                // 如果堆的大小超过了限制，移除最大元素（堆顶元素）
                if (候选邻居堆.size() > 构建过程动态候选数量) {
                    候选邻居堆.pop();
                }
            }
        }
    
    // 获取堆中的所有元素并转换为数组
    let 候选邻居列表 = 候选邻居堆.toArray();
    // 根据距离对候选邻居列表进行排序
    候选邻居列表.sort((a, b) => a.distance - b.distance);
    // 返回候选邻居列表的id数组
    return 候选邻居列表;
}
export function 从候选邻居中挑选最终邻居(数据集, 数据项, 已排序候选邻居列表, 当前层级, 模型名称) {
    const 已排序列表长度 = 已排序候选邻居列表.length;
    const 返回邻居数量 = 计算层级预期邻居数量(当前层级)
    let 返回列表 = [];

    for (let 邻居节点 of 已排序候选邻居列表) {
        // 如果返回列表已满，停止添加
        if (返回列表.length >= 返回邻居数量) {
            break;
        }
        const id = 邻居节点.id;
        const distance = 邻居节点.distance;
        // 如果已排序列表长度小于所需返回的邻居数量，直接添加
        if (已排序列表长度 < 返回邻居数量) {
            返回列表.push({ id, distance });
            continue;
        }
        let 有效 = true;
        // 遍历返回列表中的每个邻居节点
        for (let 返回邻居 of 返回列表) {
            // 获取当前邻居节点与返回列表中邻居节点之间的距离
            const 当前到返回邻居距离 = 计算数据项距离(数据项, 数据集[返回邻居.id], 模型名称);
            // 如果当前邻居节点到返回列表中任一邻居节点的距离小于到查询点的距离，则标记为无效
            if (当前到返回邻居距离 < distance) {
                有效 = false;
                break;
            }
        }
        // 如果当前邻居节点有效，则添加到返回列表
        if (有效) {
            返回列表.push({ id, distance });
        }
    }
    // 返回从小到大排序的邻居列表
    return 返回列表;
}
export function 链接邻居(数据集, 数据项, 邻居列表, 模型名称, hnsw图层级) {
    const 预期邻居数量 = 计算层级预期邻居数量(hnsw图层级);
    const 层级邻接表 = 获取数据项特定hnsw索引邻接表(数据项, 模型名称 + "_hnsw", hnsw图层级);
    if (邻居列表.length > 预期邻居数量) {
        throw new Error("邻居数量超限,图结构错误");
    }

    层级邻接表.items = 邻居列表;

    // 反过来,连接邻居项与当前项
    邻居列表.forEach(候选邻居id距离键值对 => {
        let 候选邻居的邻接表 = 获取数据项特定hnsw索引邻接表(数据集[候选邻居id距离键值对.id], 模型名称 + "_hnsw", hnsw图层级);
        let 候选邻居堆 = new 最小堆((a, b) => b.distance - a.distance);
        候选邻居的邻接表.items.forEach(item => 候选邻居堆.push(item));
        候选邻居堆.push({ id: 数据项.id, distance: 候选邻居id距离键值对.distance });

        // 维护堆的大小不超过预期邻居数量
        while (候选邻居堆.size() > 预期邻居数量) {
            候选邻居堆.pop();
        }

        候选邻居的邻接表.items = 候选邻居堆.toArray();
    });
}