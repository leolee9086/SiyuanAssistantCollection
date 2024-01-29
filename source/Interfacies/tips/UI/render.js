import { sac } from "../runtime.js";
import { 排序待添加数组 } from "../utils/tipsArrayUtils.js";
import { genTipsHTML } from "./buildTipsHTML.js";
import { 学习新词组 } from "../../../utils/tokenizer/learn.js";
import { 最小堆 } from "../../../utils/Array/minHeap.js";
//这里仅仅是为了测试
import { sacClusterChannel_Tips } from "../../../utils/cluster.js/channels.js";
let 待添加数组 = sac.statusMonitor.get('tips', 'current').$value || []
export async function 处理并显示tips(data, 编辑器上下文, renderInstance) {
    data.source = renderInstance.name
    if (data && data.item && data.item[0]) {
        let text = ''
        data.delete = () => {
            data.item.forEach(
                tipsItem => {
                    tipsItem.deleted = true
                    tipsItem.targetBlocks = tipsItem.targetBlocks || data.targetBlocks
                }
            )
        }
        for (let tipsItem of data.item) {
            tipsItem.source = tipsItem.source || data.source;
            if (待添加数组.find(item => { return item.pined })) {
                let lastPinnedIndex = 待添加数组.lastIndexOf(tip => tip.pined);
                待添加数组.splice(lastPinnedIndex + 1, 0, tipsItem);
            }
            待添加数组.push(准备渲染项目(tipsItem, 编辑器上下文))
            text += tipsItem.description
        }
        requestIdleCallback(() => { 学习新词组(text) })
    }
}
export function 准备渲染项目(tips条目, 编辑器上下文) {
    tips条目.targetBlocks = tips条目.targetBlocks || [编辑器上下文.blockID];
    tips条目.source = tips条目.source || "unknown";
    tips条目.type = 'keyboardTips';
    tips条目.delete = () => { tips条目.deleted = true }
    tips条目.pin = () => { tips条目.pined = true }
    tips条目.unpin = () => { tips条目.pined = false }
    if (!tips条目.targetBlocks) {
        return
    }
    if (!tips条目.scores) {
        tips条目.scores = {}
    }
    if (!tips条目.actionId) {
        tips条目.actionId = Lute.NewNodeID()
    }
    if (tips条目.action && 编辑器上下文) {
        tips条目.scores.actionScore = tips条目.scores.actionScore || 3
        tips条目.$action = () => {
            tips条目.action(编辑器上下文)
        }
    }
    if (tips条目.link) {
        tips条目.link = Lute.EscapeHTMLStr(tips条目.link)
    }
    if (!tips条目.content) {
        tips条目.content = genTipsHTML(tips条目)
    }
    //这是了时间排序
    if (!tips条目.time) {
        tips条目.time = Date.now()
    }
    tips条目.scores.textScore = tips条目.textScore || 0
    tips条目.scores.vectorScore = tips条目.vectorScore || 0
    return tips条目
}
// 去重待添加数组中的元素，并去除description短于两个字符的元素
function 去重待添加数组() {
    待添加数组 = 待添加数组.reduce((unique, item) => {
        if (item.description && item.description.length < 2) {
            return unique; // 如果description短于两个字符，则不添加到数组中
        }
        let isDuplicate = unique.some(
            //同源且同描述的tips会被视为重复而清除
            u => u.source === item.source
                &&
                u.description === item.description&&!item.pined
        );
        if (!isDuplicate && !item.deleted) {
            unique.push(item);
        }
        return unique;
    }, []);
    sac.statusMonitor.set('tips', 'current', 待添加数组)
}

// 限制待添加数组的长度，只保留最新的10个元素，同时保持原有顺序
async function 限制待添加数组长度(num) {
    if (待添加数组.length > (num || 1000)) {
        移除每个维度最低分的项目(待添加数组)
    }
    if (待添加数组.length > (num || 1000)) {
        // 根据time属性创建一个映射，然后根据time降序排序
        const sortedByTime = 待添加数组
            .map((item, index) => ({ index, time: item.time,pined:item.pined }))
            .sort((a, b) => {
                if (a.pined !== b.pined) {
                    return a.pined ? -1 : 1;
                } else {
                    return b.time - a.time;
                }
            })
            .slice(0, 10) // 选择最新的100个元素
            .map(item => item.index); // 转换回原数组的索引

        // 创建一个新数组，包含原数组中最新的20个元素，保持原有顺序
        待添加数组 = sortedByTime
            .sort((a, b) => a - b) // 按原索引升序排序以保持原顺序
            .map(index => 待添加数组[index]);
    }
    sac.statusMonitor.set('tips', 'current', 待添加数组)
}


export const 移除每个维度最低分的项目 = (待添加数组) => {
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
        if (heap.size() > 1) {
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
            let time = endTime - startTime;
            let avgTimePerItem = time / 待添加数组.length;
            let newLength;
            if (avgTimePerItem > SOME_THRESHOLD) {
                newLength = Math.floor(待添加数组.length * 0.9); // reduce length by 10%
            } else if (avgTimePerItem < SOME_OTHER_THRESHOLD) {
                newLength = Math.floor(待添加数组.length * 1.1); // increase length by 10%
            } else {
                newLength = 待添加数组.length; // keep the same length
            }
            // 如果去重和排序操作耗时超过100毫秒，清空数组
            限制待添加数组长度(newLength);
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

