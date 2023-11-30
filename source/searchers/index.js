import { plugin } from "../asyncModules.js"
import { 组合函数 } from "../baseStructors/functionTools.js"
import { 提取文本向量 } from "../utils/textProcessor.js"
import { searchBaidu, searchWeibo } from "./websearchers/webSearcher.js"
import { seachBlockWithVector } from "./blocksearchers/vectorSearcher.js"
import { seachBlockWithText } from "./blocksearchers/simpleTextSearcher.js"
import { searchBlock } from "./blocksearchers/combindSearcher.js"
import loadAll from './websearchers/rssLoader/index.js'
import { load } from "../../static/cheerio.js"
export async function 以文本查找最相近文档(textContent, count, 查询方法, 是否返回原始结果, 前置过滤函数, 后置过滤函数) {
    let embedding = await 提取文本向量(textContent)
    let vectors = plugin.块数据集.以向量搜索数据('vector', embedding, count, 查询方法, 是否返回原始结果, 前置过滤函数, 后置过滤函数)
    return vectors
}
plugin.searchers = {
    set: (name, values, type = 'webseacher') => {
        console.log({ name, values, type })
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
plugin.searchers.set('baidu', { search: searchBaidu },)
plugin.searchers.set('weibo', { search: searchWeibo },)
plugin.searchers.set('vector',{search:seachBlockWithVector},'blockSearcher')
plugin.searchers.set('text',{search:seachBlockWithText},'blockSearcher')
plugin.searchers.set('combind',{search:searchBlock},'blockSearcher')
export const set = (...args) => { plugin.searchers.set(...args) }
export const get = (...args) => { return plugin.searchers.get(...args) }
console.log(await loadAll())
/*class RSSList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    async connectedCallback() {
        const f = await loadRSS(plugin.selfPath+'/installed/rss/afdian/explore.js');
        const src = this.getAttribute('src');
        const urlObj = new URL(src);
        let ctx = {
            url: src,
            params: Object.fromEntries(urlObj.searchParams.entries()),
            state: {}
        };        await f(ctx);
        this.render(ctx);
    }
    render(ctx) {
        console.log(ctx)
        this.shadowRoot.innerHTML=`
        <h2><a href="${ctx.state.data.link}">${ctx.state.data.title}</a></h2>
        <p>${ctx.state.data.description}</p>
        `
        ctx.state.data.item.forEach(
            ctx=>{
                this.shadowRoot.innerHTML += `
                <div>
                    <h3><a href="${ctx.link}">${ctx.title}</a></h3>
                    <p>${ctx.description}</p>
                </div>
            `;
            }
        )
    }
}

customElements.define('rss-list', RSSList);*/