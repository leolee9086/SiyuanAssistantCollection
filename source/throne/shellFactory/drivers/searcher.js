import { embeddingText } from "../../../utils/textProcessor.js"
import { plugin } from "../../index.js"
import { searchBlock } from "./blockSearcher.js"
import { logger } from "../../../logger/index.js"
import { jieba } from '../../../utils/tokenizer.js'
import { 组合函数 } from "../../../baseStructors/functionTools.js"

async function searchBlockRef(message) {
    let refs = "";
    try {
        if (plugin.configurer.get('自动搜索设置', '搜索结果中包含块搜索结果').$value) {
            let { vectors } = message;
            let model = plugin.configurer.get('向量工具设置', '默认文本向量化模型').$value;
            let vector = vectors[model];
            if (!vector) {
                vector = await embeddingText(message.content || (message.meta && message.meta.content));
                vectors[model] = vector;
            }
            refs += await searchBlock(message, vector);
        }
    } catch (e) {
        logger.aishellerror(refs);
    }
    logger.aishelllog(refs);
    return '>these refs  from user\'s note\n'+ refs;
}

async function searchWebRef(message) {
    let refs = "";
    try {
        if (plugin.configurer.get('自动搜索设置', '搜索结果中包含网络搜索结果').$value) {
            let text = message.content || (message.meta && message.meta.content);
            let search = plugin.searchers.get('webseacher', 'baidu');
            let fArray = [];
            fArray.push(async () => { return await search(text); });
            let tokens = jieba.tokenize(text, "search");
            for (let token of tokens) {
                if (token.word.length > 2) {
                    fArray.push(async () => { return await search(token.word); });
                }
            }
            refs += ('\n'+'>these refs calculate from websearch' + (await 组合函数(fArray)()).join('\n'));
        }
    } catch (e) {
        logger.aishellerror(refs, e);
    }
    logger.aishelllog(refs);
    return refs;
}

export async function searchRef(message,AiRequestRefs) {
    try {
        let blockRefs = AiRequestRefs.local?await searchBlockRef(message):''
        let webRefs =AiRequestRefs.web?await searchWebRef(message):''
        return blockRefs + webRefs;
    } catch (error) {
        console.error(`searchRef失败:`, error);
        return '';
    }
}
