import { MinHeap as 最小堆 } from "../../../utils/Array/minHeap.js";
import { sac } from "../runtime.js";
// 限制待添加数组的长度，只保留最新的10个元素，同时保持原有顺序
export async function 限制待添加数组长度(tips数组,num) {
    if (tips数组.length > (num || 1000)) {
        移除每个维度最低分的项目(tips数组);
    }
    if (tips数组.length > (num || 1000)) {
        // 根据time属性创建一个映射，然后根据time降序排序
        const sortedByTime = tips数组
            .map((item, index) => ({ index, time: item.time, pined: item.pined }))
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
        tips数组 = sortedByTime
            .sort((a, b) => a - b) // 按原索引升序排序以保持原顺序
            .map(index => tips数组[index]);
    }
    //sac.statusMonitor.set('tips', 'current', tips数组);

    return tips数组
}
const 移除每个维度最低分的项目 = (tips数组) => {
    // 找出所有存在的维度
    const 所有评分维度 = new Set();
    for (const tips条目 of tips数组) {
        if (tips条目.scores) {
            for (const 评分维度 of Object.keys(tips条目.scores)) {
                所有评分维度.add(评分维度);
            }
        }
    }
    // 对于每个维度，使用最小堆找出得分最低的项目并移除它
    for (const dimension of 所有评分维度) {
        const heap = new 最小堆((a, b) => a.scores[dimension] - b.scores[dimension]);
        for (const item of tips数组) {
            if (item.scores && item.scores[dimension] !== undefined) {
                heap.push(item);
            }
        }
        // 如果堆中有元素，则移除得分最低的项目
        if (heap.size() > 1) {
            const 最低分项目 = heap.pop();
            const 待移除索引 = tips数组.findIndex(item => item === 最低分项目);
            if (待移除索引 !== -1) {
                tips数组.splice(待移除索引, 1);
            }
        }
    }

    return tips数组
};
// 去重待添加数组中的元素，并去除description短于两个字符的元素
export function 去重待添加数组(tips数组) {
    tips数组 = tips数组.reduce((去重结果, tips条目) => {
        if (tips条目.description && tips条目.description.length < 2) {
            return 去重结果; // 如果description短于两个字符，则不添加到数组中
        }
        let 是否重复 = 去重结果.some(
            //同源且同描述的tips会被视为重复而清除
            u => u.source === tips条目.source
                &&
                u.description === tips条目.description && !tips条目.pined
        );
        if (!是否重复 && !tips条目.deleted) {
            去重结果.push(tips条目);
        }
        return 去重结果;
    }, []);
    //sac.statusMonitor.set('tips', 'current', tips数组);

    return tips数组
}

