import { jieba } from '../../../searchers/runtime.js'
import { kernelApi } from '../../../searchers/runtime.js'
import { plugin } from '../../../searchers/runtime.js'
export const seachBlockWithText = async (text, raw) => {
    let tokens = jieba.tokenize(text, "search")
    let query = ""
    for (let token of tokens) {
        if (token.word.length >= 2) {
            query += ` OR "${token.word}"`
        }
    }
    query = query.replace("OR", "").trim()
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
        let tokenWords = new Set(tokens.map(token => token.word));
        data.blocks.forEach(block => {
            let blockTokens = jieba.tokenize(block.content, "search")
            console.log(blockTokens,tokens)
            block.commonTokensCount = blockTokens.reduce((count, token) => {
                if (tokenWords.has(token.word)) {
                    let additionalCount = [...token.word].reduce((acc, char) => {
                        return acc + (char.match(/[\u4e00-\u9fa5]/) ? 2 : 1);
                    }, 0);
                    return count + additionalCount;
                }
                return count;
            }, 0);
            if (plugin.configurer.get('聊天工具设置', '发送参考时文档和标题块发送全部内容').$value && (block.type === 'd' || block.type === 'h')) {
                let content = plugin.lute.BlockDOM2Text(kernelApi.getDoc.sync({ id: block.id, size: 102400 }).content)
                block.content = content
                return block
            }
        })
        let blocks = data.blocks.filter(block => { return block.commonTokensCount })
        // 根据共同词素数量对块进行排序
        blocks.sort((a, b) => b.commonTokensCount - a.commonTokensCount)
        // 返回共同词素数量最多的十个块
        // 使用类似rss的方式渲染以保持调用形式统一
        let res = blocks.slice(0, plugin.configurer.get('聊天工具设置', '默认参考数量').$value || 10)
        if (raw) {
            return res
        } else return {
            title: "块搜索结果",
            description: "使用分词结果搜索的块结果",
            item: res.map(
                block => {
                    return {
                        title: "文本搜索块",
                        description: block.content,
                        link: `siyuan://blocks/${block.id}`
                    }
                }
            )
        }
    }
    else return []
}
