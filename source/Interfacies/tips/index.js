import { tipsUIRouter } from './UI/router.js'
export { tipsUIRouter as router }
import { showTips } from './UI/render.js';
import { 获取光标所在位置 } from '../../utils/rangeProcessor.js';
import { sac } from './runtime.js';
import { 智能防抖 } from '../../utils/functionTools.js';
import { tipsRenderPackage } from './package/package.js';
import { 计算分词差异 } from '../../utils/tokenizer/diff.js';
import { 加载渲染实例,renderInstancies } from './package/loader.js';
import { 使用结巴拆分元素 } from '../../utils/tokenizer/jieba.js';

export const packages = [tipsRenderPackage]
let containers = []
let 显示文字搜索结果 = (editorContext, element) => {
    sac.路由管理器.internalFetch('/search/blocks/text', {
        body: {
            query: editorContext.editableElement.innerText
        },
        method: 'POST',
    }).then(
        res => {
            let data = res.body
            if (data && data.item) {
                data.item = data.item.map(
                    item => {
                        item.targetBlocks = [editorContext.blockID]
                        return item
                    }
                )
            }
            res.body ? showTips(data, element,editorContext) : null
        }
    )
}
let 显示向量搜索结果 = (editorContext, element) => {
    console.log(element)
    sac.路由管理器.internalFetch('/search/blocks/vector', {
        body: {
            query: editorContext.editableElement.innerText,
        },
        method: 'POST',
    }).then(
        res => {
            let data = res.body
            if (data && data.item) {
                data.item = data.item.map(
                    item => {
                        item.targetBlocks = [editorContext.blockID]
                        return item
                    }
                )
            }
            res.body ? showTips(data, element,editorContext) : null
        }
    )
}
let 上一个分词结果 = []
let 显示tips = (e) => {
    let { pos, editableElement, blockElement, parentElement } = 获取光标所在位置();
    let 分词结果数组 = 使用结巴拆分元素(editableElement)
    let 当前光标所在分词结果数组 = 分词结果数组.filter((token) => {
        return (token.start <= pos && token.end >= pos) && (token.word && token.word.trim().length > 1);
    }).sort((a, b) => {
        return b.word.length - a.word.length
    });
    if (计算分词差异(分词结果数组, 上一个分词结果) >= 5) {
        上一个分词结果 = 分词结果数组
    } else {
        return
    }
    if (!分词结果数组[0]) {
        return
    }
    if (!当前光标所在分词结果数组[0]) {
        return
    }
    let editorContext = {
        position: pos,
        text: editableElement.innerText,
        tokens: 分词结果数组,
        currentToken: 当前光标所在分词结果数组[0],
        blockID: blockElement.getAttribute('data-node-id'),
        editableElement
    }
    //这一段是文字搜索*/
    containers.forEach(
        element => {
            try {
                智能防抖(显示文字搜索结果, () => { console.log("文字查询被阻断") })(editorContext, element)
                智能防抖(显示向量搜索结果, () => { console.log("向量查询被阻断") })(editorContext, element)
            } catch (e) {
                console.error('基础tips渲染出错', e)
            }
            renderInstancies.forEach(
                renderInstance => {
                    try{
                    console.log(editorContext, 当前光标所在分词结果数组, 分词结果数组, pos)
                    let asyncRender = async () => {
                        return await renderInstance.renderTips(editorContext)
                    }
                    asyncRender().then(data => {
                        data.source = renderInstance.name
                        data.item.forEach(
                            item => {
                                item.targetBlocks = [editorContext.blockID]
                                item.source = renderInstance.name
                            }
                        )
                        console.log(data)
                        showTips(data, element,editorContext)
                    })
                    }catch(e){
                        console.warn(e)
                    }
                }
            )
        }
    )
}
const 构建tips显示界面 = (element) => {
    try {
        显示tips()
    } catch (e) {
        console.error(e)
    }
    containers.push(element)
}
export const docks = {
    TipsMain: {
        async init(element) {
            console.log(element)
            构建tips显示界面(element)
        }
    }
}
export const tabs = {
    focusedTips: {
        init(element, data, tab) {
            element.innerHTML = `
      <div id="SAC-TIPS_pinned"  style="overflow:auto;max-height:30%"></div>
      <div id="SAC-TIPS" class='fn__flex-1' style="overflow:auto;max-height:100%">
            
      </div>
   
        `;
            构建tips显示界面(element)
        }
    }
}


export const Emitter = class {
    async onload() {
        const tipsRenderPackagesAsync = async () => { return await sac.statusMonitor.get('packages', 'sac-tips-render').$value }
        let tipsPackagesDefine = await tipsRenderPackagesAsync()
        let tipsRenders = await tipsPackagesDefine.local.list()
        for (let renderName of tipsRenders) {
            await 加载渲染实例(tipsPackagesDefine, renderName);
        }
    }
    channel = 'tips-ui';
    ["@main-" + sac.事件管理器.DOM键盘事件表.文本输入] = (e) => {
        显示tips(e)
    }
    ["@main-" + sac.事件管理器.DOM键盘事件表.组合结束] = (e) => {
        显示tips(e)
    }
}


