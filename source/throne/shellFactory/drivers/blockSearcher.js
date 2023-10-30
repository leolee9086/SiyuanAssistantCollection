import { seachWithVector } from '../../../vectorStorage/blockIndex.js'
import { jieba } from '../../../utils/tokenizer.js'
import kernelApi from '../../../polyfills/kernelApi.js'
import { plugin } from '../../../asyncModules.js'
export const seachBlockWithVector = async (vector) => {
    let blocks = await seachWithVector('vector', vector, plugin.configurer.get('聊天工具设置', '默认参考数量').$value || 30)
    //  return blocks.map(item => { return item.meta&&item.score>0.8}).filter(item=>{return item})
    blocks = blocks.filter(item => { return item.meta && item.similarityScore > 0.5 }).map(
        item => {
            try {
                if (plugin.configurer.get('聊天工具设置', '发送参考时文档和标题块发送全部内容').$value && item.meta.type === 'd' || item.meta.type === 'h') {
                    let block = JSON.parse(JSON.stringify(item.meta))
                    let content = plugin.lute.BlockDOM2Text(kernelApi.getDoc.sync({ id: item.id, size: 102400 }).content)
                    block.content = content
                    return block
                }
                return item.meta
            } catch (e) {
                console.error(e)
                return undefined
            }
        }
    )
    return blocks.filter(item => { return item })
}
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
export const searchBlock = async (message, vector) => {
    let blocks1 = await seachBlockWithVector(vector)
    let blocks2 = []
    if (blocks1.length < plugin.configurer.get('聊天工具设置', '默认参考数量').$value) {
        blocks2 = await await seachBlockWithText(message.content || (message.meta && message.meta.content))
    }
    let blocks = blocks1.concat(blocks2)
    blocks.sort((a, b) => {
        return new Date(b.updated) - new Date(a.updated);
    })
    return buildRefs(blocks.slice(0, plugin.configurer.get('聊天工具设置', '默认参考数量').$value || 10))
}
function buildRefs(blocks) {
    let refs = ""
    let seen1 = new Set()
    let seen2 = new Set()
    let 最大文字长度 = plugin.configurer.get('聊天工具设置', '参考文字最大长度').$value
    let 总参考最大长度 = plugin.configurer.get('聊天工具设置', '总参考最大长度').$value
    blocks.forEach(ref => {
        if (ref.id && ref.content && !seen1.has(ref.id) && refs.length < 总参考最大长度) {
            let obj = { id: ref.id, content: ref.content }
            refs += `\n[${obj.content.substring(0, 最大文字长度 || 512)}](siyuan://blocks/${obj.id})`
            seen1.add(ref.id)
            seen2.add(ref.content)
        }
    })
    return refs
}