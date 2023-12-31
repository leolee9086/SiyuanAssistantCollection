import { plugin,组合函数,logger,提取文本向量 } from "./runtime.js"
import { searchBaidu, searchWeibo } from "./websearchers/index.js"
import { seachBlockWithVector } from "./blocksearchers/vectorSearcher.js"
import { seachBlockWithText } from "./blocksearchers/simpleTextSearcher.js"
import { searchBlock } from "./blocksearchers/combindSearcher.js"
export async function 以文本查找最相近文档(textContent, count, 查询方法, 是否返回原始结果, 前置过滤函数, 后置过滤函数) {
    let embedding = await 提取文本向量(textContent)
    let vectors = plugin.块数据集.以向量搜索数据('vector', embedding, count, 查询方法, 是否返回原始结果, 前置过滤函数, 后置过滤函数)
    return vectors
}
const searchers = {
    set: (name, values, type = 'webseacher') => {
        logger.searcherlog({ name, values, type })
        plugin.configurer.set('自动搜索设置', type, name, {
            排序权重: 0.5,
            启用: false
        })
        // 获取当前的值
        let currentValue = plugin.statusMonitor.get('searchers', type, name).$value || [];
        // 如果 values 是一个数组，就合并值
        if (Array.isArray(values)) {
            currentValue = [...currentValue, ...values];
        }
        // 如果 values 是一个对象，就添加值
        else if (typeof values === 'object') {
            currentValue.push(values);
        }
        plugin.statusMonitor.set('searchers', type, name, {
            $type: type,
            $value: currentValue
        })
    },
    get: (type = 'webseacher', name) => {
        let values = plugin.statusMonitor.get('searchers', type, name).$value
        if (values && values[0]) {
            return 组合函数(values.map(value => {
                return value.search
            }))
        }
    }
}
searchers.set('baidu', { search: searchBaidu },)
searchers.set('weibo', { search: searchWeibo },)
searchers.set('vector', { search: seachBlockWithVector }, 'blockSearcher')
searchers.set('text', { search: seachBlockWithText }, 'blockSearcher')
searchers.set('combind', { search: searchBlock }, 'blockSearcher')
let parseRss
try{
    parseRss=  (await import('./websearchers/rssLoader/index.js')).parseRss
}catch(e){
    console.error(e)
}
logger.searcherlog(parseRss)
export const set = (...args) => { plugin.searchers.set(...args) }
export const get = (...args) => { return plugin.searchers.get(...args) }
export {searchers}
plugin.searchers=searchers