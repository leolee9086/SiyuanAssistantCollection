import { 柯里化 } from "../../../../utils/functionTools.js";
import { 计算余弦相似度 } from "../vector.js";
import { 查找最相似点 } from "../vector.js";
export const 以过滤函数和向量字段名创建查询数据集 = (数据集对象, 向量字段名, 前置过滤函数) => {

    let 主键值数组 = Object.getOwnPropertyNames(数据集对象);
    // 使用filter和map替换forEach
    let 查询数据集 = 主键值数组
        .filter(主键值 => !前置过滤函数 || 前置过滤函数(数据集对象[主键值]))
        .map(主键值 => {
            return {
                data: 数据集对象[主键值],
                vector: 数据集对象[主键值][向量字段名]
            }
        });
    return 查询数据集;
}
export const 迁移数据项向量结构 = (数据项) => {
    if (Array.isArray(数据项.vector)) {
        console.warn('0.0.1之后,数据项的向量应该是一个字典,数据项将迁移到新的数据结构')
        数据项.vector = { 'vector': 数据项.vector };
    }
    return 数据项;
}
export const 初始化数据项向量字段 = (数据项)=>{
    if (数据项.vector) {
        Object.keys(数据项.vector).forEach(key => {
            if (!Array.isArray(数据项.vector[key]) || 数据项.vector[key].some(v => typeof v !== 'number')) {
                console.warn(`数据项的vector字段中的${key}不是有效的向量`);
                // 初始化或修正该项为有效向量，这里假设向量是二维的，仅作为示例
                数据项.vector[key] = [0, 0]; // 或者其他逻辑来初始化向量
            }
        });
    } else {
        console.warn('数据项没有向量字段,将创建新的');
        // 初始化数据项的向量数据
        数据项.vector = {};
    }
    return 数据项
}
export const 获取数据项向量字段值 = (数据项, 向量字段名) => {
    return 数据项.vector[向量字段名] || [];
}
export const 处理查询结果 = (查询结果) => {
    查询结果 = 查询结果.map(
        item => {
            let obj = JSON.parse(JSON.stringify(item.data.data))
            obj.similarityScore = item.score
            return obj
        }
    )
    return 查询结果
}
export const 应用后置过滤函数 = (查询结果, 后置过滤函数) => {
    if (后置过滤函数) {
        查询结果 = 查询结果.filter(
            item => {
                return 后置过滤函数(item)
            }
        )
    }
    return 查询结果
}
export const 准备向量查询函数 = (数据集对象) => {
    return (向量字段名, 向量值, 结果数量 = 10, 前置过滤函数, 后置过滤函数) => {
        let 查询数据集 = 柯里化(以过滤函数和向量字段名创建查询数据集)(数据集对象)(向量字段名)(前置过滤函数)
        let 查询结果 = 查找最相似点(向量值, 查询数据集, 结果数量, 计算余弦相似度)
        查询结果 = 处理查询结果(查询结果)
        // 查询结果 = this.应用后置过滤函数(查询结果, 后置过滤函数)
        查询结果 = 应用后置过滤函数(查询结果, 后置过滤函数)
        return 查询结果
    }
}