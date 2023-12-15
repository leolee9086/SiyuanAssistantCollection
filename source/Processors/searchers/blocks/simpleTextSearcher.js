import { jieba } from '../runtime.js'
import { kernelApi } from '../runtime.js'
export const 创建搜索语句 = (tokens) => {
    let query = ""
    for (let token of tokens) {
        if (token.word.length >= 2) {
            query += ` OR "${token.word}"`
        }
    }
    query = query.replace("OR", "").trim()
    return query
}
export const 根据共同词素数量对块进行排序 = (blocks, tokens, 标题和文档包含全部内容 = false) => {
    let tokenWords = new Set(tokens.map(token => token.word));
    blocks.forEach(block => {
        let blockTokens = jieba.tokenize(block.content, "search")
        block.commonTokensCount = blockTokens.reduce((count, token) => {
            if (tokenWords.has(token.word)) {
                let additionalCount = [...token.word].reduce((acc, char) => {
                    return acc + (char.match(/[\u4e00-\u9fa5]/) ? 2 : 1);
                }, 0);
                return count + additionalCount;
            }
            return count;
        }, 0);
        if (标题和文档包含全部内容
            //&& (block.type === 'd' || block.type === 'h')
        ) {
            // let content = Lute.New().BlockDOM2Text(kernelApi.getDoc.sync({ id: block.id, size: 102400 }).content)
            let content = kernelApi.getDoc.sync({ id: block.id, size: 3 }).content
            block.content = content
            return block
        }
    })
    blocks = blocks.filter(block => { return block.commonTokensCount })
    // 根据共同词素数量对块进行排序
    blocks.sort((a, b) => b.commonTokensCount - a.commonTokensCount)
    return blocks
}
export const seachBlockWithText = async (text, options = { 使用原始结果: false, 结果数量: 10, 标题和文档包含全部内容: false }) => {
    console.log(text, options)
    let 分词结果 = jieba.tokenize(text, "search")
    let { 结果数量, 标题和文档包含全部内容, 使用原始结果 } = options
    let query = 创建搜索语句(分词结果)
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
        // 返回共同词素数量最多的十个块
        // 使用类似rss的方式渲染以保持调用形式统一
        let blocks = 根据共同词素数量对块进行排序(data.blocks, 分词结果, 标题和文档包含全部内容)
        let res = blocks.slice(0, 结果数量)
        if (使用原始结果) {
            return res
        } else return {
            title: "块搜索结果",
            description: "使用分词结果搜索的块结果",
            item: res.map(
                block => {
                    return {
                        title: "文本搜索块",
                        description: block.content,
                        link: `siyuan://blocks/${block.id}`,
                        block:block,
                        source:'localBlockText',
                        textScore:block.commonTokensCount,
                        id:block.id
                    }
                }
            )
        }
    }
    else return []
}
