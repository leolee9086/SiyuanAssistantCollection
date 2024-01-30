import { sac } from "../runtime.js";
import { 排序待添加数组 } from "../utils/tipsArrayUtils.js";
import { 学习新词组 } from "../../../utils/tokenizer/learn.js";
//这里仅仅是为了测试
import { sacClusterChannel_Tips } from "../../../utils/cluster.js/channels.js";
import { 准备渲染项目 } from "../utils/item.js";
import { 限制待添加数组长度 } from "./cleaner.js";
import { 去重待添加数组 } from "./cleaner.js";
export let 待添加数组 = sac.statusMonitor.get('tips', 'current').$value || []
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
        requestIdleCallback(()=>去重待添加数组(待添加数组));
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
            限制待添加数组长度(待添加数组,newLength);
        } else {
            限制待添加数组长度(待添加数组);
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

