import { seachWithVector } from '../../../vectorStorage/blockIndex.js'
import { jieba } from '../../../utils/tokenizer.js'
import kernelApi from '../../../polyfills/kernelApi.js'
import { plugin } from '../../../asyncModules.js'
export const seachBlockWithVector = async (vector) => {
    let blocks = await seachWithVector('vector', vector, 30)
    return blocks.map(item => { return item.meta&&item.score>0.8}).filter(item=>{return item})
}
export const seachBlockWithText = async (text) => {
    let tokens = jieba.tokenize(text, "search")
    let query=""
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
        })
        // 根据共同词素数量对块进行排序
        data.blocks.sort((a, b) => b.commonTokensCount - a.commonTokensCount)
        // 返回共同词素数量最多的十个块
        return data.blocks.slice(0, 10)
    }
    else return []
}
export const searchBlock = async (message, vector) => {
    let blocks1 = await seachBlockWithText(message.content||(message.meta&&message.meta.content))
    let blocks2 = await seachBlockWithVector(vector)
    let blocks = blocks1.concat(blocks2)
    return buildRefs(blocks)
}
function buildRefs(blocks) {
    let refs = ""
    let seen1 = new Set()
    let seen2 = new Set()
    let 最大文字长度 = plugin.configurer.get('聊天工具设置','参考文字最大长度').$value
    blocks.forEach(ref => {

        if (ref.id && ref.content && !seen1.has(ref.id) ) {
            let obj = { id: ref.id, content: ref.content }
            refs += `\n[${obj.content.substring(0, 最大文字长度||512)}](siyuan://blocks/${obj.id})`
            seen1.add(ref.id)
            seen2.add(ref.content)
        }
    })
    return refs
}