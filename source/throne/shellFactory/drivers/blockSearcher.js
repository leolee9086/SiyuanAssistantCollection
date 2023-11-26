import { jieba } from '../../../utils/tokenizer.js'
import kernelApi from '../../../polyfills/kernelApi.js'
import { plugin } from '../../../asyncModules.js'
import { logger } from '../../../logger/index.js'
export const seachBlockWithVector= plugin.searchers.get('blockSearcher', 'vector')
export const seachBlockWithText= plugin.searchers.get('blockSearcher', 'text')

export const searchBlock = async (message, vector) => {
    let blocks1 = []
    try {
         blocks1 = await seachBlockWithVector(vector)
    }catch(e){
        logger.searcherror(e)
    }
    let blocks2 = []
    if (blocks1.length < plugin.configurer.get('聊天工具设置', '默认参考数量').$value) {
        blocks2 = await await seachBlockWithText(message.content || (message.meta && message.meta.content))
    }
    let blocks = blocks1.concat(blocks2)
    blocks.sort((a, b) => {
        // 首先比较 similarityScore
        if (a.similarityScore !== b.similarityScore) {
            return b.similarityScore - a.similarityScore;
        }
        // 如果 similarityScore 相同，比较 commonTokensCount
        if (a.commonTokensCount !== b.commonTokensCount) {
            return b.commonTokensCount - a.commonTokensCount;
        }
        // 如果 similarityScore 和 commonTokensCount 都相同，比较 updated
        return new Date(b.updated) - new Date(a.updated);
    });
    return buildRefs(blocks.slice(0, plugin.configurer.get('聊天工具设置', '默认参考数量').$value || 10))
}
function buildRefs(blocks) {
    let refs = []
    let seen1 = new Set()
    let seen2 = new Set()
    let 最大文字长度 = plugin.configurer.get('聊天工具设置', '参考文字最大长度').$value
    blocks.forEach(ref => {
        if (ref.id && ref.content && !seen1.has(ref.id) ) {
            let obj = { id: ref.id, content: ref.content }
            refs.push (`\n[${obj.content.substring(0, 最大文字长度 || 512)}](siyuan://blocks/${obj.id})`)
            seen1.add(ref.id)
            seen2.add(ref.content)
        }
    })
    return refs
}