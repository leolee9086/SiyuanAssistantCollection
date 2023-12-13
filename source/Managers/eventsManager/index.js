import * as 插件基础事件列表 from "./SiyuanBaseEventTypeList.js";
import { EventEmitter } from "./EventEmitter.js";
export { 插件基础事件列表 as 基础事件 }
export { EventEmitter }
export { EventEmitter as 事件触发器及 }
import { 启用收集protyle事件 } from "./protyleEvents.js";
import { 开始监听DOM键盘事件, DOM键盘事件表 } from "./DOMKeyBoardEvent.js";
import { sac } from "./runtime.js";
import { 智能防抖 } from "../../utils/functionTools.js";
import { 使用结巴拆分元素 } from "../../utils/tokenizer.js";
import { 获取光标所在位置 } from "../../utils/rangeProcessor.js";
//监听原生事件触发自定义事件
启用收集protyle事件()
开始监听DOM键盘事件()
//模块之间不允许使用事件机制进行互相调用,而是使用函数路由
//只有事件管理器允许触发模块的事件
let 显示tips =智能防抖(async (e) => {
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
            query:editableElement.innerText
        },
        method: 'POST',
    })
    res.body ? sac.路由管理器.internalFetch('/tips/UI/show', {
        body: res.body,
        method: "POST"
    }) : null
    //这一段是向量搜索
    let res1 = await sac.路由管理器.internalFetch('/search/blocks/vector', {
        body: {
            query:editableElement.innerText,
        },
        method: 'POST',
    })
    res1.body ? sac.路由管理器.internalFetch('/tips/UI/show', {
        body: res1.body,
        method: "POST"
    }) : null
})
sac.eventBus.on(DOM键盘事件表.文本输入,(e)=>{
    显示tips(e)
})
sac.eventBus.on(DOM键盘事件表.组合结束,async(e)=>{
   // console.log(sac.路由管理器.internalFetch('/search/rss/list',{body:{},method:'POST'}))
   // console.log(sac.路由管理器.internalFetch('/search/rss/router',{body:{name:"199it"},method:'POST'}))
    显示tips(e)
})
