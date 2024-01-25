import { 柯里化 } from "../../../../utils/functionTools.js";
import {  计算归一化向量余弦相似度, } from "../../../../utils/vector/similarity.js";
import { 查找最相似点 } from "../vector.js";
import Mingo from '../../../../../static/mingo.js'
export const 以过滤函数和向量字段名创建查询数据集 = (数据集对象, 向量字段名, 前置查询条件) => {
    // 将数据集对象的值转换为数组
    let 数据集数组 = Object.values(数据集对象);
    let 过滤后的数据集数组 = 数据集数组
    if (前置查询条件) {
        let query = new Mingo.Query(前置查询条件);
        过滤后的数据集数组 = query.find(数据集数组).all();
    }
    // 创建Mingo查询对象
    // 将过滤后的数组映射到所需的结构
    let 查询数据集 = 过滤后的数据集数组.map(数据项 => ({
        data: 数据项,
        vector: 数据项.vector[向量字段名]
    }));
    return 查询数据集;
}
export const 处理查询结果 =async (查询结果,后置过滤条件) => {
    查询结果 = 查询结果.map(
        item => {
            let obj = structuredClone(item.data.data)
            obj.similarityScore = item.score
            return obj
        }
    )
    查询结果 = await  应用后置过滤函数(查询结果,后置过滤条件)
    return 查询结果
}
export const 应用后置过滤函数 = (查询结果, 后置过滤条件) => {
    if (后置过滤条件) {
        let query = new Mingo.Query(后置过滤条件);
        let 过滤后的查询结果 = query.find(查询结果).all();
        return 过滤后的查询结果
    }
    return 查询结果
}

export const 准备向量查询函数 = (数据集对象) => {
    return async(向量字段名, 向量值, 结果数量 = 10, 前置过滤条件, 后置过滤条件) => {
        let 查询数据集 = 柯里化(以过滤函数和向量字段名创建查询数据集)(数据集对象)(向量字段名)(前置过滤条件)
        let 查询结果 =await 查找最相似点(向量值, 查询数据集, 结果数量,计算归一化向量余弦相似度)
        查询结果 =await 处理查询结果(查询结果,后置过滤条件)
        return 查询结果
    }
}


