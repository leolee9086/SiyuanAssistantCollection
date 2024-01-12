import { 智能防抖} from "../../../utils/functionTools.js";
import { sac } from "../runtime.js";
import { 排序待添加数组 } from "../utils/tipsArrayUtils.js";
import { genTipsHTML } from "./buildTipsHTML.js";
import { withPerformanceLogging } from "../../../utils/functionAndClass/performanceRun.js";
let 待添加数组 = globalThis[Symbol.for('sac-tips')] || []
globalThis[Symbol.for('sac-tips')] = 待添加数组

export function 处理并显示tips(data, element, 编辑器上下文) {
    if(data&&data.item&&data.item[0])
    for (let tipsItem of data.item) {
        tipsItem.targetBlocks = [编辑器上下文.blockID];
        tipsItem.source = tipsItem.source || data.source;
        tipsItem.type = 'keyboardTips';
        if (!tipsItem.targetBlocks) {
            return
        }
        if (!tipsItem.actionId) {
            tipsItem.actionId = Lute.NewNodeID()
        }
        if (tipsItem.action) {
            tipsItem.$action = () => {
                tipsItem.action(编辑器上下文)
            }
        }
        待添加数组.push(准备渲染项目(tipsItem))

    }
    智能防抖(批量渲染(element))
}

const 准备渲染项目 = (item) => {
    if (item) {
        // 如果不存在，则添加新的元素
        let divHTML = genTipsHTML(item)
        return {
            content: divHTML,
            time: Date.now(),
            textScore: item.textScore || 0,
            vectorScore: item.vectorScore || 0,
            ...item
        }
        // tipsConainer.querySelector("#SAC-TIPS").innerHTML += (divHTML)
    }
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
async function 批量渲染(element) {
   // let frag = document.createDocumentFragment();
    controller.abort()
    const newcontroller = new AbortController();
    signal = newcontroller.signal
    controller = newcontroller
    if (!element) {
        return;
    }
    withPerformanceLogging(去重待添加数组)();
    withPerformanceLogging(排序待添加数组)(待添加数组);
    限制待添加数组长度();
    //这里待会要改一下
    globalThis[Symbol.for('sac-tips')] = 待添加数组
}
const 合并tips数组 = () => {
    let tipsSource = sac.statusMonitor.get('tips', 'current').$value
    if (tipsSource && tipsSource.length > 0) {
        // 添加第一个list到待添加数组
        待添加数组 = 待添加数组.concat(tipsSource.shift().item.map(tipsItem => {
            return 准备渲染项目(tipsItem)
        }));
        // 更新tipsSource以反映删除的list
        sac.statusMonitor.set('tips', 'current', tipsSource);
    }
}
function 安排合并tips数组() {
    requestIdleCallback(() => {
        合并tips数组();
        安排合并tips数组(); // 任务完成后再次安排
    });
}
安排合并tips数组();

