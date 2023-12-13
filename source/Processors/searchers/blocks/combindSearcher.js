import { seachBlockWithText } from "./simpleTextSearcher.js"
import { seachBlockWithVector } from "./vectorSearcher.js"
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
    return blocks
}