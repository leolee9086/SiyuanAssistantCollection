import { 智能防抖, 柯里化 } from "../../../utils/functionTools.js";
import { sac } from "../runtime.js";
import { 排序待添加数组 } from "../utils/tipsArrayUtils.js";
import { openFocusedTipsByEvent } from "./events.js";
import { genTipsHTML } from "./buildTipsHTML.js";
import { withPerformanceLogging } from "../../../utils/functionAndClass/performanceRun.js";
let 待添加数组 = globalThis[Symbol.for('sac-tips')] || []
globalThis[Symbol.for('sac-tips')] = 待添加数组
export const showTips = (tipsItems, element, context) => {
    console.log(element)
    buildTips(tipsItems, element, context)
}

export const buildTips = async (item, element, context) => {
    console.log(item)
    item.item && item.item.forEach(
        item => {
            if (!item.targetBlocks) {
                return
            }
            if (!item.actionId) {
                item.actionId = Lute.NewNodeID()
            }
            if (item.action) {
                item.$action = () => {
                    item.action(context)
                }
            }
            待添加数组.push(准备渲染项目(item))
        }
    )
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

let clickHandeler = (event) => {
    柯里化(openFocusedTipsByEvent)(event)(待添加数组)
}
// 移除和添加事件监听器
function 更新事件监听(element) {
    element.removeEventListener('click', clickHandeler);
    element.addEventListener('click', clickHandeler);
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
// 创建 DocumentFragment 并添加待添加数组中的元素，并支持中断操作
function 创建并添加元素到DocumentFragment(frag, signal) {
    console.log(待添加数组.length)
    let div = document.createElement('div');

    for (let index = 0; index < 20&&index<待添加数组.length; index++) {
        if (signal.aborted) {
            console.log(`Operation aborted at index ${index}`);
            break; // 使用 break 来确保完全退出循环
        }
        div.innerHTML=待添加数组[index].content
        frag.appendChild(div.firstChild);
    }

}
// 将选中的元素移动到 DocumentFragment 的顶部
function 移动选中元素到顶部(element, frag) {
    element.querySelectorAll(".b3-card__info").forEach(div => {
        let checkbox = div.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            frag.prepend(div);
        }
    });
}
// 更新元素内容，并支持中断操作
function 更新元素内容(element, frag,) {
    if (signal.aborted) {
        console.log('Operation aborted before updating content');

        return;
    }
    element.querySelector('#SAC-TIPS').innerHTML = '';
    element.querySelector('#SAC-TIPS').appendChild(frag);
}



let controller = new AbortController();
let { signal } = controller;
// 批量渲染函数，使用上述拆分的函数
async function 批量渲染(element) {
    let frag = document.createDocumentFragment();
    controller.abort()
    const newcontroller = new AbortController();
    signal = newcontroller.signal
    controller = newcontroller
    if (!element) {
        return;
    }
    更新事件监听(element);
    withPerformanceLogging(去重待添加数组)();
    withPerformanceLogging(排序待添加数组)(待添加数组);
    
    限制待添加数组长度();
    console.log(待添加数组)
    globalThis[Symbol.for('sac-tips')] = 待添加数组

   // withPerformanceLogging(移动选中元素到顶部)(element, frag);
   // withPerformanceLogging(创建并添加元素到DocumentFragment)(frag, signal);
   // withPerformanceLogging(更新元素内容)(element, frag,signal);
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