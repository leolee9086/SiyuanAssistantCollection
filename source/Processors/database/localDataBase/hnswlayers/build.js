import { 最小堆 } from "../../../../utils/Array/minHeap.js";
import { hnsw索引元设置, 计算层级预期邻居数量 } from "../config.js";
import { 计算数据项距离 } from "../utils/distance.js";
import {  获取数据项特定hnsw索引邻接表 } from "../utils/item.js";
import { withPerformanceLogging } from "../../../../utils/functionAndClass/performanceRun.js";
import { 选择入口点 } from "./entry.js";
function 根据层级获取节点邻居候选(数据集, 目标数据项, 当前层入口点, 模型名称, 当前层级) {
    let 候选邻居列表 = [];
    let 访问过的节点 = new Set();
    //一个最小堆,用于维护最近节点
    let 优先队列 = new 最小堆((a, b) => a.distance - b.distance);
    //一个最大堆,用于维护结果
    let 结果队列 = new 最小堆((a, b) => b.distance - a.distance)
    let 当前距离 = 计算数据项距离(当前层入口点, 目标数据项)
    // 初始化优先队列
    优先队列.push({ data: 当前层入口点, distance: 当前距离 });
    结果队列.push({ data: 当前层入口点, distance: 当前距离 })
    while (!优先队列.isEmpty()) {
        let { data, distance } = 优先队列.pop();
        //如果当前找到的最近距离都比之前的距离要大,而且结果队列已经够长了
        if(distance>=当前距离&&结果队列.size()>=hnsw索引元设置.构建过程动态候选数量){
            break
        }
        当前距离=distance
        if (!访问过的节点.has(data.id)) {
            访问过的节点.add(data.id);
            let 邻居节点 = data;
            let 邻居节点的当前层级邻接表 = 获取数据项特定hnsw索引邻接表(邻居节点, `${模型名称}_hnsw`, 当前层级);
            if (!邻居节点的当前层级邻接表) {
                console.log(邻居节点, 当前层级)
            }
            for (let 邻居记录 of 邻居节点的当前层级邻接表.items) {
                if (!访问过的节点.has(邻居记录.id)) {
                    let 邻居数据项 = 数据集[邻居记录.id];
                    if (邻居数据项) {
                        let 邻居距离 = 计算数据项距离(目标数据项, 邻居数据项, 模型名称);
                        if (结果队列.size() < hnsw索引元设置.构建过程动态候选数量 || 邻居距离 < 当前距离) {
                            优先队列.push({ data: 邻居数据项, distance: 邻居距离 });
                            结果队列.push({ data: 邻居数据项, distance: 邻居距离 })
                            if (结果队列.size() > hnsw索引元设置.构建过程动态候选数量) {
                                //如果结果太多了,就需要把最远的弹出
                                //之后检查就以这个最远距离为标准,不满足就算了
                                当前距离= 结果队列.pop().distance
                            }
                        }
                    }
                }
            }
        }
    }
    // 从优先队列中获取所有候选邻居
    while (!结果队列.isEmpty()) {

        let 候选邻居 = 结果队列.pop();
        候选邻居列表.push(候选邻居);
    }
    // 返回候选邻居列表,由于结果队列是一个最大堆,所以需要反转
    return 候选邻居列表.reverse()
}
function 从候选邻居中挑选最终邻居(数据集, 待插入数据项, 已排序候选邻居列表, 当前层级, 模型名称) {
    const 已排序列表长度 = 已排序候选邻居列表.length;
    const 返回邻居数量 = 计算层级预期邻居数量(当前层级)
    let 返回列表 = [];
    for (let 邻居节点记录 of 已排序候选邻居列表) {
        // 如果返回列表已满，停止添加
        if (返回列表.length >= 返回邻居数量) {
            break;
        }
        const 邻居节点 = 邻居节点记录.data;
        const distance = 邻居节点记录.distance;
        // 如果已排序列表长度小于所需返回的邻居数量，直接添加
        if (已排序列表长度 < 返回邻居数量) {
            返回列表.push({ data:邻居节点, distance });
            continue;
        }
        let 有效 = true;
        // 遍历返回列表中的每个邻居节点
        for (let 邻居节点记录 of 返回列表) {
            // 获取当前邻居节点与返回列表中邻居节点之间的距离
            const 当前到返回邻居距离 = 计算数据项距离(邻居节点,邻居节点记录.data , 模型名称);
            //如果当前邻居节点到返回列表中任一邻居节点的距离小于到查询点的距离，则标记为无效
            //这是为了保证小世界图的性质,也就是存在一些"高速公路"节点,它们能够非常快速地导航到其他节点
            if (当前到返回邻居距离 < distance) {
                有效 = false;
                break;
            }
        }
        // 如果当前邻居节点有效，则添加到返回列表
        if (有效) {
            返回列表.push({data:邻居节点, distance });
        }
    }
    // 返回从小到大排序的邻居列表
    return 返回列表.sort((a, b) => a.distance - b.distance);
}
function 链接邻居(数据集, 数据项, 邻居列表, 模型名称, hnsw图层级) {
    const 预期邻居数量 = 计算层级预期邻居数量(hnsw图层级);
    const 层级邻接表 = 获取数据项特定hnsw索引邻接表(数据项, 模型名称 + "_hnsw", hnsw图层级);
    if (邻居列表.length > 预期邻居数量) {
        throw new Error("邻居数量超限,图结构错误");
    }
    //上一步传递的直接是数据项目,所以要提取它们的id和距离
    层级邻接表.items = 邻居列表.map(邻居记录=>{return {id:邻居记录.data.id,distance:邻居列表.distance}});
    let 最近邻居 = null
    let 最近邻居距离 = Infinity
    // 反过来,连接邻居项与当前项
    邻居列表.forEach(邻居节点记录 => {
        let 候选邻居的邻接表 = 获取数据项特定hnsw索引邻接表(邻居节点记录.data, 模型名称 + "_hnsw", hnsw图层级);
        //这实际上是一个最大堆
        let 候选邻居堆 = new 最小堆((a, b) => b.distance - a.distance);
        候选邻居的邻接表.items.forEach(item => 候选邻居堆.push(item));
        候选邻居堆.push({ id: 数据项.id, distance: 邻居节点记录.distance });
        // 维护堆的大小不超过预期邻居数量
        while (候选邻居堆.size() > 预期邻居数量) {
            候选邻居堆.pop();
        }
        候选邻居的邻接表.items = 候选邻居堆.toArray();
        if (邻居节点记录.distance < 最近邻居距离) {
            最近邻居距离 = 邻居节点记录.distance;
            最近邻居 = 邻居节点记录.data;
        }
    });
    return 最近邻居
}
function 贪心搜索当前层级构建入口(数据集, 当前层入口点, 待插入数据项, hnsw索引名称, 当前层级, 模型名称) {
    let 最近点 = 当前层入口点;
    let 最近距离 = 计算数据项距离(当前层入口点, 待插入数据项, 模型名称);
    let 改进 = true;
    let 已遍历点 = new Set([最近点.id]);

    while (改进) {
        改进 = false;
        let 当前层邻接表 = 获取数据项特定hnsw索引邻接表(最近点, hnsw索引名称, 当前层级);
        for (let 邻居 of 当前层邻接表.items) {
            if (!已遍历点.has(邻居.id)) {
                已遍历点.add(邻居.id);
                if (数据集[邻居.id]) {
                    let 邻居距离 = 计算数据项距离(数据集[邻居.id], 待插入数据项, 模型名称);
                    if (邻居距离 < 最近距离) {
                        最近点 = 数据集[邻居.id];
                        最近距离 = 邻居距离;
                        改进 = true;
                        break; // 找到更近的邻居，跳出循环继续搜索
                    }
                }
            }
        }
    }
    return { data: 最近点, distance: 最近距离 };
}

export function 为数据项构建hnsw索引(数据集, 待插入数据项, 模型名称, hnsw层级映射) {
    let hnsw索引名称 = `${模型名称}_hnsw`
    let 邻接表 = 待插入数据项.neighbors[hnsw索引名称]
    let 已遍历入口点 = new Set()
    let 拟插入层级 = 邻接表.length - 1
    let 当前层入口点 = 选择入口点(数据集, 模型名称, hnsw层级映射, 已遍历入口点)
    let 当前距离 = 2
    for (let 当前层级 = 拟插入层级; 当前层级 >= 0; 当前层级--) {
        let 贪心搜索当前层级结果 = 贪心搜索当前层级构建入口(数据集, 当前层入口点, 待插入数据项, hnsw索引名称, 当前层级, 模型名称)
        //索引中使用的是余弦距离
        当前距离 = 贪心搜索当前层级结果.distance
        当前层入口点 = 贪心搜索当前层级结果.data
        let 当前层候选邻居表 = 根据层级获取节点邻居候选(数据集, 待插入数据项, 当前层入口点, 模型名称, 当前层级, hnsw层级映射)
        let 最终邻居表 = 从候选邻居中挑选最终邻居(数据集, 待插入数据项, 当前层候选邻居表, 当前层级, 模型名称)
        let 下一层级入口 = 链接邻居(数据集, 待插入数据项, 最终邻居表, 模型名称, 当前层级)
        if (下一层级入口) {
            当前层入口点 = 下一层级入口
        }
    }
}