import { jieba } from '../../utils/tokenizer.js'
import kernelApi from '../../polyfills/kernelApi.js'
import { plugin } from '../../asyncModules.js'
import { logger } from '../../logger/index.js'

export const seachBlockWithText = async (text) => {
    let tokens = jieba.tokenize(text, "search")
    let query = ""
    for (let token of tokens) {
        if (token.word.length >= 2) {
            query += ` OR "${token.word}"`
        }
    }
    query = query.replace("OR").trim()
    let data = await kernelApi.fullTextSearchBlock({
        "query": query,
        "method": 1,
        "types": { "document": true, "heading": true, "list": false, "listItem": false, "codeBlock": true, "htmlBlock": true, "mathBlock": true, "table": true, "blockquote": true, "superBlock": true, "paragraph": true, "embedBlock": false },
        "paths": [],
        "groupBy": 0,
        "orderBy": 0,
        "page": 1

    })
    if (data && data.blocks[0]) {
        // 计算每个块与查询文本的共同词素数量
        data.blocks.forEach(block => {
            let blockTokens = jieba.tokenize(block.content, "search")
            block.commonTokensCount = blockTokens.filter(token => tokens.includes(token)).length
            if (plugin.configurer.get('聊天工具设置', '发送参考时文档和标题块发送全部内容').$value && block.type === 'd' || block.type === 'h') {
                let content = plugin.lute.BlockDOM2Text(kernelApi.getDoc.sync({ id: block.id, size: 102400 }).content)
                block.content = content
                return block
            }
        })
        // 根据共同词素数量对块进行排序
        data.blocks.sort((a, b) => b.commonTokensCount - a.commonTokensCount)
        // 返回共同词素数量最多的十个块
        return data.blocks.slice(0, plugin.configurer.get('聊天工具设置', '默认参考数量').$value || 10)
    }
    else return []
}
