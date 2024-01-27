import { 智能防抖 } from "../../../utils/functionTools.js";
import { sac } from "../runtime.js";
import { 排序待添加数组 } from "../utils/tipsArrayUtils.js";
import { genTipsHTML } from "./buildTipsHTML.js";
import { 学习新词组 } from "../../../utils/tokenizer/learn.js";
import { 最小堆 } from "../../../utils/Array/minHeap.js";
let 待添加数组 = sac.statusMonitor.get('tips', 'current').$value || []
export async function 处理并显示tips(data, 编辑器上下文, renderInstance) {
    data.source = renderInstance.name

    if (data && data.item && data.item[0]) {
        let text = ''
        for (let tipsItem of data.item) {
            tipsItem.source = tipsItem.source || data.source;
            待添加数组.push(准备渲染项目(tipsItem, 编辑器上下文))
            text += tipsItem.description
        }

        requestIdleCallback(() => { 学习新词组(text) })

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
        if (!isDuplicate) {
            unique.push(item);
        }
        return unique;
    }, []);
}

// 限制待添加数组的长度，只保留最新的10个元素，同时保持原有顺序
async function 限制待添加数组长度(num) {
    if (待添加数组.length > (num || 1000)) {
        移除每个维度最低分的项目(待添加数组)
    }
    if (待添加数组.length > (num || 1000)) {

        // 根据time属性创建一个映射，然后根据time降序排序
        const sortedByTime = 待添加数组
            .map((item, index) => ({ index, time: item.time }))
            .sort((a, b) => b.time - a.time)
            .slice(0, 10) // 选择最新的100个元素
            .map(item => item.index); // 转换回原数组的索引

        // 创建一个新数组，包含原数组中最新的20个元素，保持原有顺序
        待添加数组 = sortedByTime
            .sort((a, b) => a - b) // 按原索引升序排序以保持原顺序
            .map(index => 待添加数组[index]);
    }
}


export const 移除每个维度最低分的项目 = (待添加数组, 最小堆实现) => {
    // 找出所有存在的维度
    const allDimensions = new Set();
    for (const item of 待添加数组) {
        if (item.scores) {
            for (const dimension of Object.keys(item.scores)) {
                allDimensions.add(dimension);
            }
        }
    }
    // 对于每个维度，使用最小堆找出得分最低的项目并移除它
    for (const dimension of allDimensions) {
        const heap = new 最小堆((a, b) => a.scores[dimension] - b.scores[dimension]);   
        for (const item of 待添加数组) {
            if (item.scores && item.scores[dimension] !== undefined) {
                heap.push(item);
            }
        }
        // 如果堆中有元素，则移除得分最低的项目
        if (!heap.isEmpty()) {
            const lowestScoreItem = heap.pop();
            const indexToRemove = 待添加数组.findIndex(item => item === lowestScoreItem);
            if (indexToRemove !== -1) {
                待添加数组.splice(indexToRemove, 1);
            }
        }
    }
};





let tips整理中 = false;
let controller = new AbortController();

async function 批量渲染() {
    if (tips整理中) {
        // 如果已经在整理中，则不再触发新的整理
        return;
    }

    tips整理中 = true;
    controller.abort(); // 取消之前的操作
    const newController = new AbortController();
    const { signal } = newController;

    try {
        const startTime = performance.now();

        requestIdleCallback(去重待添加数组);
        requestIdleCallback(() => 排序待添加数组(待添加数组, signal));

        const endTime = performance.now();
        if (endTime - startTime > 50) {
            // 如果去重和排序操作耗时超过100毫秒，清空数组
            限制待添加数组长度(20);
        } else {
            限制待添加数组长度();
        }

        sac.statusMonitor.set('tips', 'current', 待添加数组);
    } catch (e) {
        // 错误处理
    } finally {
        // 无论成功或失败，都重置控制器和标志
        controller = newController;
        tips整理中 = false;
        调度批量渲染();
    }
}

// 使用requestIdleCallback来调度批量渲染，设置一个合理的timeout
function 调度批量渲染() {
    requestIdleCallback(批量渲染);
}

// 初始调度
调度批量渲染();

