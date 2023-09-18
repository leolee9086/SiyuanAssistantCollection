import {plugin,clientApi,kernelApi} from '../runtime.js'

export default async (_context) => {
    let 块数据集 = _context.plugin.块数据集
    let { kernelApi } = _context
    async function 以文本查找最相近文档(textContent, count, 查询方法, 是否返回原始结果, 前置过滤函数, 后置过滤函数) {
        let embedding = await plugin.文本处理器.提取文本向量(textContent)
        let vectors = 块数据集.以向量搜索数据('vector', embedding, count, 查询方法, 是否返回原始结果, 前置过滤函数, 后置过滤函数)
        return vectors
    }
    let results = []
    results = await 以文本查找最相近文档(_context.blocks[0].content, 10, '', false, null, (b) => {
        return kernelApi.checkBlockExist.sync({ id: b.meta.id })
    })
    if (results[0]) {
        return results.map(
            item => {
                let block = item.meta
                return {
                    icon: '',
                    label: item.meta.content,
                    hints: `替换为近似内容:${item.meta.content}`,
                    hintAction: async (context) => {
                        context.token.select()
                        context.protyle.insert(block.conntent)
                    },

                }
            }
        )
    }
}
