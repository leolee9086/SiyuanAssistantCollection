import { 计算归一化向量余弦相似度 } from "../../../../utils/vector/similarity.js";
import { hnsw索引元设置 } from "../config.js";
import { 获取数据项向量字段值, 获取数据项特定hnsw索引邻接表 } from "../utils/item.js";
import { 获取数据项所在hnsw层级 } from "./utils.js";
import { MinHeap } from "../../../../utils/Array/minHeap.js";
const 选择入口点 = (数据集, 模型名称, hnsw层级映射) => {
    let hnsw索引名称 = `${模型名称}_hnsw`;
    let 目标层级 = hnsw索引元设置.最大层级 - 1;

    // 利用hnsw层级映射来加速查找过程
    while (目标层级 >= 0) {
        if (hnsw层级映射[模型名称][目标层级] && hnsw层级映射[模型名称][目标层级].length > 0) {
            // 使用映射中存储的id来直接访问数据项
            for (let id of hnsw层级映射[模型名称][目标层级]) {
                let 数据项 = 数据集[id];
                if (数据项 && 数据项.neighbors[hnsw索引名称] && 数据项.neighbors[hnsw索引名称].length > 目标层级) {
                    return 数据项; // 返回第一个找到的候选点
                }
            }
        }
        目标层级--;
    }

    // 如果所有层级都没有点，则返回null
    return null;
};
// 贪心搜索在当前层级找到更近的点
/*function 贪心搜索当前层级N个点(数据集, 当前点, 查询向量, hnsw索引名称, 当前层级, 模型名称) {
    let N = hnsw索引元设置.搜索过程动态候选数量
    let 最小堆 = new MinHeap((a, b) => {return a.score - b.score});
    let 当前点特征向量 = 获取数据项向量字段值(数据集[当前点.id], 模型名称);
    let 当前点距离 = 1 - 计算归一化向量余弦相似度(查询向量, 当前点特征向量);
    最小堆.push({ data: 当前点, score: 当前点距离 });
    let 已访问 = new Set([当前点.id]);
    let 发现更小值 = true
    while (!发现更小值) {
        //查看当前的最小值
        发现更小值=false
        let { data: 当前点 } = 最小堆.peek();
        //获取最近邻居的邻居
        let 当前层邻接表 = 获取数据项特定hnsw索引邻接表(当前点, hnsw索引名称, 当前层级);
        for (let 邻居 of 当前层邻接表.items) {
            if (!已访问.has(邻居.id)) {
                let 邻居特征向量 = 获取数据项向量字段值(数据集[邻居.id], 模型名称);
                let 邻居距离 = 1 - 计算归一化向量余弦相似度(查询向量, 邻居特征向量);
                if (最小堆.size() < N || 邻居距离 < 最小堆.peek().score) {
                    最小堆.push({ data: 数据集[邻居.id], score: 邻居距离 });
                    已访问.add(邻居.id);
                    发现更小值=true
                }
            }
        }
    }
    let 结果 = [];
    while (!最小堆.isEmpty()&&结果.length<N) {
        结果.push(最小堆.pop());
    }
    return 结果.reverse();
}*/
function 贪心搜索当前层级(数据集, 当前点, 查询向量, hnsw索引名称, 当前层级, 模型名称) {
    let 最近点 = 当前点;

    let 最近点特征向量 = 获取数据项向量字段值(数据集[最近点.id], 模型名称)
    //console.log(数据集[最近点.id],最近点)
    let 最近距离 = 1 - 计算归一化向量余弦相似度(查询向量, 最近点特征向量);
    let 改进 = true;
    let 已遍历点 = []
    let 当前层邻接表 = 获取数据项特定hnsw索引邻接表(当前点, hnsw索引名称, 当前层级);
    while (改进 && !已遍历点.length === 当前层邻接表.items.length) {
        改进 = false;
        for (let 邻居 of 当前层邻接表.items) {
            //因为可能没有加载完成,此时进行局部搜索
            已遍历点.push(邻居.id)
            if (数据集[邻居.id]) {
                //console.log(数据集[邻居.id],邻居)
                let 邻居距离 = 1 - 计算归一化向量余弦相似度(数据集[邻居.id].vector[模型名称], 查询向量);
                if (邻居距离 < 最近距离) {
                    最近点 = 数据集[邻居.id]
                    最近距离 = 邻居距离;
                    改进 = true;
                }
            }
        }
    }
    return { data: 最近点, score: 最近距离 };
}
export function hnswAnn搜索数据集(数据集, 模型名称, 查询向量, N = 1,hnsw层级映射) {
    // ...其他代码保持不变...
    let 入口点 = 选择入口点(数据集, 模型名称,hnsw层级映射);
    if (!入口点) {
        // 如果没有找到入口点，可能需要处理错误或返回空结果
        return null;
    }
    let hnsw索引名称 = `${模型名称}_hnsw`;
    let 目标层级 = 获取数据项所在hnsw层级(入口点, 模型名称);
    // 从最高层开始贪心搜索，直到最底层
    let 当前点 = 入口点;
    let 当前距离 = 2;
    let 结果点集 = new MinHeap((a, b) => a.score - b.score);
    let 最远邻居 = new MinHeap((a, b) => b.score - a.score)
    //实际候选数量是搜索值和动态候选数中较大的那一个
    let 实际候选数量 = Math.max(N, hnsw索引元设置.搜索过程动态候选数量)

    for (let 层 = 目标层级; 层 >= 0; 层--) {
        // ...其他代码保持不变...

        let 贪心搜索当前层级结果 = 贪心搜索当前层级(数据集, 当前点, 查询向量, hnsw索引名称, 层, 模型名称, N);
        // ...其他代码保持不变...
        当前距离 = 贪心搜索当前层级结果.score
        当前点 = 贪心搜索当前层级结果.data

        //console.log(当前距离,当前点)
        //当没有下降到零层的时候
        if (层 > 0) {
            let 跳转结果 = 转到下一层(当前点, 层, hnsw索引名称, 数据集, 查询向量, 模型名称)
            当前距离 = 跳转结果.score
            当前点 = 跳转结果.data
        }
        //下降到零层之后
        else if (层 == 0) {
            //避免重复访问
            let 已遍历点 = new Set()
            //在0层遍历时,避免原地转圈
            let 跳转距离下界 = Infinity
            //结果点集是一个最小堆
            结果点集.push({ data: 当前点, score: 当前距离 })
            最远邻居.push({ data: 当前点, score: 当前距离 })
            跳转距离下界 = 当前距离
            已遍历点.add(当前点.id)

            let 当前层邻接表 = 获取数据项特定hnsw索引邻接表(当前点, hnsw索引名称, 层);
            //结果点集是一个最大堆
            while (最远邻居.size() > 0) {
                //这是当前最远的点
                let { data: 当前参考点, score: 当前参考距离 } = 最远邻居.pop();
                if (当前参考距离 > 跳转距离下界) {
                    break
                }
                当前层邻接表 = 获取数据项特定hnsw索引邻接表(当前参考点, hnsw索引名称, 层);
                for (let 邻居 of 当前层邻接表.items) {
                    if (!已遍历点.has(邻居.id)) {
                        已遍历点.add(邻居.id)
                        if (数据集[邻居.id]) {
                            let 邻居特征向量 = 获取数据项向量字段值(数据集[邻居.id], 模型名称);
                            let 邻居距离 = 1 - 计算归一化向量余弦相似度(查询向量, 邻居特征向量);
                            if (结果点集.size() < 实际候选数量 || 邻居距离 < 跳转距离下界) {
                                最远邻居.push({ data: 数据集[邻居.id], score: 邻居距离 });
                                结果点集.push({ data: 数据集[邻居.id], score: 邻居距离 });
                                跳转距离下界 = 邻居距离
                            }
                        }
                    }
                }
            }
        }
    }

    let 结果 = [];

    while (结果.length < N && 结果点集.size() > 0) {
        let heapItem = 结果点集.pop();
        let item = { ...heapItem.data, score: 1 - heapItem.score }; // 克隆data并转换分数为相似度
        结果.push(item);
    }
    return structuredClone(结果); 
}
/*export function hnswAnn搜索数据集(数据集, 模型名称, 查询向量) {
   let 入口点 = 选择入口点(数据集, 模型名称);
   if (!入口点) {
       // 如果没有找到入口点，可能需要处理错误或返回空结果
       return null;
   }
   
   let hnsw索引名称 = `${模型名称}_hnsw`;
   let 目标层级 = 获取数据项所在hnsw层级(入口点,模型名称);
   // 从最高层开始贪心搜索，直到最底层
   let 当前点 = 入口点;
   let 当前距离 = 2
   for (let 层 = 目标层级; 层 >= 0; 层--) {
       //console.log(当前点,层)
       let 贪心搜索当前层级结果 = 贪心搜索当前层级(数据集, 当前点, 查询向量, hnsw索引名称,层,模型名称)
       // 如果不是最底层，需要转到下一层的相应邻居
       当前距离 = 贪心搜索当前层级结果.score
       当前点 = 贪心搜索当前层级结果.data
       //console.log(当前距离,当前点)
       if (层 > 0) {
           let 跳转结果 = 转到下一层(当前点, 层, hnsw索引名称,数据集,查询向量,模型名称)
           当前距离 =跳转结果.score
           当前点 = 跳转结果.data
       }
   }
   let 结果点 = structuredClone(当前点)
   结果点.score =1-当前距离
   // 返回最底层找到的最近点
   return [结果点];
}*/
// 假设每个数据项的neighbors属性是一个对象，其中键是层级，值是那个层级的邻居ID数组
function 转到下一层(当前点, 当前层级, hnsw索引名称, 数据集, 查询向量, 模型名称) {
    // 获取当前点在下一层级的邻居
    let 下一层级 = Math.max(当前层级 - 1, 0);
    let 下一层邻居们 = 获取数据项特定hnsw索引邻接表(数据集[当前点.id], hnsw索引名称, 下一层级);
    //console.log(下一层邻居们,数据集[当前点.id])
    let 最近邻居 = 下一层邻居们.items[0] || 当前点;
    let 最近邻居距离 = Number.MAX_VALUE;
    // 遍历下一层的邻居，找到与查询向量距离最近的邻居
    for (let 邻居点 of 下一层邻居们.items) {
        //因为可能没有加载完成
        if (数据集[邻居点.id]) {
            //console.log(邻居点,数据集[邻居点.id])
            let 邻居向量 = 数据集[邻居点.id].vector[模型名称];
            let 距离 = 1 - 计算归一化向量余弦相似度(邻居向量, 查询向量);
            if (距离 < 最近邻居距离) {
                最近邻居距离 = 距离;
                最近邻居 = 数据集[邻居点.id];
            }
        }
    }
    // 返回最近的邻居，如果没有邻居则返回null
    return { data: 最近邻居, score: 最近邻居距离 };
}