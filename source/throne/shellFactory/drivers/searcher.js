import { embeddingText } from "../../../utils/textProcessor.js"
import { plugin } from "../../index.js"
import { searchBlock } from "./blockSearcher.js"
import { logger } from "../../../logger/index.js"
export async function searchRef(message) {
    try {
        let { meta, vectors } = message
        let model = plugin.configurer.get('向量工具设置', '默认文本向量化模型').$value
        let vector = vectors[model]
        if (!vector) {
            vector = await embeddingText(meta.content)
            vectors[model] = vector
        }
        let refs = await searchBlock(message, vector)
        logger.aishelllog(refs)
        return refs
    } catch (error) {
        console.error(`searchRef失败:`, error);
        return ''
    }
}
