import { embeddingText } from "../../../utils/textProcessor.js"
import { plugin } from "../../index.js"
import { searchBlock } from "./blockSearcher.js"
export async function searchRef(message) {
    try {
        
        console.log(message)
        let { meta, vectors } = message
        let model = plugin.configurer.get('向量工具设置', '默认文本向量化模型').$value
        let vector = vectors[model]
        if (!vector) {
            vector = await embeddingText(meta.content)
            vectors[model] = vector
        }
        let refs = await searchBlock(message, vector)
        console.log(refs)
        return refs
    } catch (error) {
        console.error(`searchRef失败:`, error);
        return ''
    }
}
