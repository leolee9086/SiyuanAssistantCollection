import { 智能防抖 } from "../../../utils/functionTools.js";
import { sac } from "../runtime.js";
import { 排序待添加数组 } from "../utils/tipsArrayUtils.js";
import { genTipsHTML } from "./buildTipsHTML.js";
import { withPerformanceLogging } from "../../../utils/functionAndClass/performanceRun.js";
let 待添加数组 = sac.statusMonitor.get('tips', 'current').$value || []
export async function 处理并显示tips(data, 编辑器上下文) {
    if (data && data.item && data.item[0])
        for (let tipsItem of data.item) {
            tipsItem.source = tipsItem.source || data.source;
            待添加数组.push(准备渲染项目(tipsItem, 编辑器上下文))
        }
}
export function 准备渲染项目(tipsItem, 编辑器上下文) {
    tipsItem.targetBlocks = tipsItem.targetBlocks || [编辑器上下文.blockID];
    tipsItem.source = tipsItem.source || "unknown";
    tipsItem.type = 'keyboardTips';
    if (!tipsItem.targetBlocks) {
        return
    }
    if (!tipsItem.actionId) {
        tipsItem.actionId = Lute.NewNodeID()
    }
    if (tipsItem.action && 编辑器上下文) {
        tipsItem.$action = () => {
            tipsItem.action(编辑器上下文)
        }
    }
    if (tipsItem.link) {
        tipsItem.link = Lute.EscapeHTMLStr(tipsItem.link)
    }
    if (!tipsItem.content) {
        tipsItem.content = genTipsHTML(tipsItem)
    }
    if (!tipsItem.time) {
        tipsItem.time = Date.now()
    }
    tipsItem.textScore = tipsItem.textScore || 0
    tipsItem.vectorScore = tipsItem.vectorScore || 0
    return tipsItem
}
// 去重待添加数组中的元素，并去除description短于两个字符的元素
function 去重待添加数组() {
    待添加数组 = 待添加数组.reduce((unique, item) => {
        if (item.description && item.description.length < 2) {
            return unique; // 如果description短于两个字符，则不添加到数组中
        }
        let isDuplicate = unique.some(u => u.id === item.id && u.description === item.description);
        return isDuplicate ? unique : [...unique, item];
    }, []);
}

// 限制待添加数组的长度，只保留最新的10个元素，同时保持原有顺序
function 限制待添加数组长度() {
    if (待添加数组.length > 100) {
        // 根据time属性创建一个映射，然后根据time降序排序
        const sortedByTime = 待添加数组
            .map((item, index) => ({ index, time: item.time }))
            .sort((a, b) => b.time - a.time)
            .slice(0, 20) // 选择最新的100个元素
            .map(item => item.index); // 转换回原数组的索引

        // 创建一个新数组，包含原数组中最新的100个元素，保持原有顺序
        待添加数组 = sortedByTime
            .sort((a, b) => a - b) // 按原索引升序排序以保持原顺序
            .map(index => 待添加数组[index]);
    }
}
let controller = new AbortController();
let { signal } = controller;
// 批量渲染函数，使用上述拆分的函数

let tips整理中
async function 批量渲染() {

    let f = () => {
        tips整理中 = true
        try {
            // let frag = document.createDocumentFragment();
            controller.abort()
            const newcontroller = new AbortController();
            signal = newcontroller.signal
            controller = newcontroller
            智能防抖(withPerformanceLogging(去重待添加数组))(signal)
            智能防抖(withPerformanceLogging(排序待添加数组))(待添加数组, signal);
            限制待添加数组长度()
            //这里待会要改一下
            tips整理中 = false

            sac.statusMonitor.set('tips', 'current', 待添加数组)
        } catch (e) {
            const newcontroller = new AbortController();
            signal = newcontroller.signal
            controller = newcontroller
            tips整理中 = false
        }
        requestAnimationFrame(批量渲染)

    }
    if (!tips整理中) {
        requestIdleCallback(f)
        return
    }

    requestIdleCallback(批量渲染)
}
requestIdleCallback(批量渲染)