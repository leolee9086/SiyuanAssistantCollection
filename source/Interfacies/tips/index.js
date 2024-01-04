import { tipsUIRouter } from './UI/router.js'
export { tipsUIRouter as router }
import { showTips } from './UI/render.js';
import { 使用结巴拆分元素 } from '../../utils/tokenizer.js';
import { 获取光标所在位置 } from '../../utils/rangeProcessor.js';
import { sac } from './runtime.js';
import { 智能防抖 } from '../../utils/functionTools.js';
import { tipsRenderPackage } from './package.js';
export const packages = [tipsRenderPackage]
const renderInstancies = []
let 显示文字搜索结果=(editableElement)=>{
    sac.路由管理器.internalFetch('/search/blocks/text', {
        body: {
            query: editableElement.innerText
        },
        method: 'POST',
    }).then(
        res => {
            res.body ? sac.eventBus.emit('tips-ui-render-all', res.body) : null

        }
    )
}
let 显示向量搜索结果=(editableElement)=>{
 
        sac.路由管理器.internalFetch('/search/blocks/vector', {
            body: {
                query: editableElement.innerText,
            },
            method: 'POST',
        }).then(
            res => {
                res.body ? sac.eventBus.emit('tips-ui-render-all', res.body) : null
            }
        )
    
}
function 计算分词差异(currentTokenResults, previousTokenResults) {
    // 创建两个集合，一个用于存储当前的分词结果，一个用于存储上一次的分词结果
    let currentTokenSet = new Set(currentTokenResults.map(token => token.word));
    let previousTokenSet = new Set(previousTokenResults.map(token => token.word));

    // 计算两个集合的差集，即当前分词结果中存在但上一次分词结果中不存在的词语
    let differenceSet = new Set([...currentTokenSet].filter(word => !previousTokenSet.has(word)));

    // 变化幅度定义为差集的大小
    let changeMagnitude = differenceSet.size;

    return changeMagnitude;
}
let 上一个分词结果 = []
let 显示tips = async (e) => {
    let { pos, editableElement, blockElement, parentElement } = 获取光标所在位置();
    let 分词结果数组 = 使用结巴拆分元素(editableElement)
    let 当前光标所在分词结果数组 = 分词结果数组.filter((token) => {
        return (token.start <= pos && token.end >= pos) && (token.word && token.word.trim().length > 1);
    }).sort((a, b) => {
        return b.word.length - a.word.length
    });
    console.log(分词结果数组)
    if(计算分词差异(分词结果数组,上一个分词结果)>=5){
       上一个分词结果=分词结果数组 
    }else{
        return
    }
    if (!分词结果数组[0]) {
        return
    }
    //这一段是文字搜索*/
    try {
        智能防抖(显示文字搜索结果,()=>{console.log("文字查询被阻断")})(editableElement)
        智能防抖(显示向量搜索结果,()=>{console.log("向量查询被阻断")})(editableElement)
    } catch (e) {
        console.error('基础tips渲染出错', e)
    }
    renderInstancies.forEach(
        renderInstance => {
            let asyncRender = async () => {
                return await renderInstance.renderTips({
                    "测试": "测试"
                })
            }
            asyncRender().then(data => {
                data.source = renderInstance.name
                data.item.forEach(
                    item => item.source = renderInstance.name
                )
                showTips(data)
            })
        }
    )
}

export const Emitter = class {
    async onload() {
        const tipsRenderPackagesAsync = async () => { return await sac.statusMonitor.get('packages', 'sac-tips-render').$value }
        let tipsPackagesDefine = await tipsRenderPackagesAsync()
        let tipsRenders = await tipsPackagesDefine.local.list()
        console.log(tipsRenders)
        tipsRenders.forEach(
            renderName => {
                tipsPackagesDefine.local.load(renderName).then(
                    renderClass => {
                        let renderInstance = new renderClass()
                        console.log(renderInstance)
                        renderInstance.__proto__.sac = sac
                        renderInstance.__proto__.internalFetch = sac.路由管理器.internalFetch
                        renderInstance.__proto__.name = renderName
                        renderInstance.Lute = Lute
                        renderInstancies.push(renderInstance)
                        console.log(renderInstancies)
                    }
                )
            }
        )
    }
    channel = 'tips-ui';
    ['render-all'] = (e) => {
        showTips(e)
    }
    ["@main-" + sac.事件管理器.DOM键盘事件表.文本输入] = (e) => {
        显示tips(e)
    }
    ["@main-" + sac.事件管理器.DOM键盘事件表.组合结束] = (e) => {
        显示tips(e)
    }
}