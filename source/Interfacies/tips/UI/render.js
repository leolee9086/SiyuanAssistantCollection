import { 智能防抖} from "../../../utils/functionTools.js";
import { sac } from "../runtime.js";
import { 排序待添加数组 } from "../utils/tipsArrayUtils.js";
import { genTipsHTML } from "./buildTipsHTML.js";
import { withPerformanceLogging } from "../../../utils/functionAndClass/performanceRun.js";
let 待添加数组 = sac.statusMonitor.get('tips','current').$value||[]
export async function 处理并显示tips(data, 编辑器上下文) {
    if(data&&data.item&&data.item[0])
    for (let tipsItem of data.item) {
        tipsItem.source = tipsItem.source || data.source;
        待添加数组.push(准备渲染项目(tipsItem,编辑器上下文))
    }
    智能防抖(批量渲染())
}
export function 准备渲染项目(tipsItem,编辑器上下文){
    tipsItem.targetBlocks =tipsItem.targetBlocks|| [编辑器上下文.blockID];
    tipsItem.source = tipsItem.source || "unknown";
    tipsItem.type = 'keyboardTips';
    if (!tipsItem.targetBlocks) {
        return
    }
    if (!tipsItem.actionId) {
        tipsItem.actionId = Lute.NewNodeID()
    }
    if (tipsItem.action&&编辑器上下文) {
        tipsItem.$action = () => {
            tipsItem.action(编辑器上下文)
        }
    }
    if(tipsItem.link){
        tipsItem.link=Lute.EscapeHTMLStr(tipsItem.link)
    }
    if(!tipsItem.content){
        tipsItem.content = genTipsHTML(tipsItem)
    }
    if(!tipsItem.time){
        tipsItem.time=Date.now()
    }
    tipsItem.textScore= tipsItem.textScore || 0
    tipsItem.vectorScore=tipsItem.vectorScore || 0
    return tipsItem
}
// 去重待添加数组中的元素
function 去重待添加数组() {
    待添加数组 = 待添加数组.reduce((unique, item) => {
        return unique.some(u => u.id === item.id) ? unique : [...unique, item];
    }, []);
}

// 限制待添加数组的长度
function 限制待添加数组长度() {
    if (待添加数组.length > 1000) {
        待添加数组 = 待添加数组.slice(0, 1000);
    }
}

let controller = new AbortController();
let { signal } = controller;
// 批量渲染函数，使用上述拆分的函数
async function 批量渲染() {
   // let frag = document.createDocumentFragment();
    controller.abort()
    const newcontroller = new AbortController();
    signal = newcontroller.signal
    controller = newcontroller
    withPerformanceLogging(去重待添加数组)();
    withPerformanceLogging(排序待添加数组)(待添加数组);
    限制待添加数组长度();
    //这里待会要改一下
    sac.statusMonitor.set('tips','current',待添加数组)
}
