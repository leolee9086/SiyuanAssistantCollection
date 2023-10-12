import { plugin } from "../asyncModules.js"
export async function 以文本查找最相近文档(textContent, count, 查询方法, 是否返回原始结果, 前置过滤函数, 后置过滤函数) {
    let embedding = await plugin.文本处理器.提取文本向量(textContent)
    let vectors = plugin.块数据集.以向量搜索数据('vector', embedding, count, 查询方法, 是否返回原始结果, 前置过滤函数, 后置过滤函数)
    return vectors
}
