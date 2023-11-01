import { embeddingText } from "../../../utils/textProcessor.js"
import { plugin } from "../../index.js"
import { searchBlock } from "./blockSearcher.js"
import { logger } from "../../../logger/index.js"
import { serachBaidu } from "./webSearcher.js"
import { jieba } from '../../../utils/tokenizer.js'

export async function searchRef(message) {
    try {
        let refs = ""
        if (plugin.configurer.get('自动搜索设置', '搜索结果中包含块搜索结果').$value) {
            let { vectors } = message
            let model = plugin.configurer.get('向量工具设置', '默认文本向量化模型').$value
            let vector = vectors[model]
            if (!vector) {
                vector = await embeddingText(message.content || (message.meta && message.meta.content))
                vectors[model] = vector
            }
            refs += await searchBlock(message, vector)
        }
        logger.aishelllog(refs)
        if (plugin.configurer.get('自动搜索设置', '搜索结果中包含网络搜索结果').$value) {
            let webSearcherResults = [];

            let text = message.content || (message.meta && message.meta.content)
            let result1 = await serachBaidu(text);
            webSearcherResults.push(result1);
            let tokens = jieba.tokenize(text, "search")
            for (let token of tokens) {
                if (token.word.length > 2) {
                    let result = await serachBaidu(token.word);
                    webSearcherResults.push(result);
                }
            }
            refs += '\n' + webSearcherResults.join('\n')
        }
        logger.aishelllog(refs)
        return refs 
    } catch (error) {
        console.error(`searchRef失败:`, error);
        return ''
    }
}
