import { plugin } from '../../../asyncModules.js'
import { logger } from '../../../logger/index.js'
export const seachBlockWithVector= plugin.searchers.get('blockSearcher', 'vector')
export const seachBlockWithText= plugin.searchers.get('blockSearcher', 'text')
export const combindSearchBlock= plugin.searchers.get('blockSearcher', 'combind')

export const searchBlock = async (message, vector) => {
    let blocks = await combindSearchBlock(message,vector)
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