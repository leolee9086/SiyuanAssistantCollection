import {tipsUIRouter} from './UI/router.js'
export {tipsUIRouter as router}
import { showTips } from './UI/render.js';
import { 使用结巴拆分元素 } from '../../utils/tokenizer.js';
import { 获取光标所在位置 } from '../../utils/rangeProcessor.js';
import { sac } from './runtime.js';
import { 智能防抖 } from '../../utils/functionTools.js';
let 显示tips = 智能防抖(async (e) => {
    let { pos, editableElement, blockElement, parentElement } = 获取光标所在位置();
    let 分词结果数组 = 使用结巴拆分元素(editableElement).filter((token) => {
        return (token.start <= pos && token.end >= pos) && (token.word && token.word.trim().length > 1);
    }).sort((a, b) => {
        return b.word.length - a.word.length
    });
    if (!分词结果数组[0]) {
        return
    }
    //这一段是文字搜索
    let res = await sac.路由管理器.internalFetch('/search/blocks/text', {
        body: {
            query: editableElement.innerText
        },
        method: 'POST',
    })
    res.body?sac.eventBus.emit('tips-ui-render-all',res.body):null
    let res1 = await sac.路由管理器.internalFetch('/search/blocks/vector', {
        body: {
            query: editableElement.innerText,
        },
        method: 'POST',
    })
    res1.body?sac.eventBus.emit('tips-ui-render-all',res1.body):null
})
sac.eventBus.on(sac.事件管理器.DOM键盘事件表.文本输入,(e)=>{
    显示tips(e)
})
sac.eventBus.on(sac.事件管理器.DOM键盘事件表.组合结束,(e)=>{
    显示tips(e)
})
export const Emitter=class {
    channel='tips-ui';
    ['render-all']=(e)=>{
        console.log(e)
        showTips(e)
    }
}