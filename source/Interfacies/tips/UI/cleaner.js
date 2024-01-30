import { MinHeap as 最小堆 } from "../../../utils/Array/minHeap.js";
import { sac } from "../runtime.js";
// 限制待添加数组的长度，只保留最新的10个元素，同时保持原有顺序
export async function 限制待添加数组长度(待添加数组,num) {
    if (待添加数组.length > (num || 1000)) {
        移除每个维度最低分的项目(待添加数组);
    }
    if (待添加数组.length > (num || 1000)) {
        // 根据time属性创建一个映射，然后根据time降序排序
        const sortedByTime = 待添加数组
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
        待添加数组 = sortedByTime
            .sort((a, b) => a - b) // 按原索引升序排序以保持原顺序
            .map(index => 待添加数组[index]);
    }
    sac.statusMonitor.set('tips', 'current', 待添加数组);
}



const 移除每个维度最低分的项目 = (待添加数组) => {
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
// 去重待添加数组中的元素，并去除description短于两个字符的元素
export function 去重待添加数组(待添加数组) {
    待添加数组 = 待添加数组.reduce((unique, item) => {
        if (item.description && item.description.length < 2) {
            return unique; // 如果description短于两个字符，则不添加到数组中
        }
        let isDuplicate = unique.some(
            //同源且同描述的tips会被视为重复而清除
            u => u.source === item.source
                &&
                u.description === item.description && !item.pined
        );
        if (!isDuplicate && !item.deleted) {
            unique.push(item);
        }
        return unique;
    }, []);
    sac.statusMonitor.set('tips', 'current', 待添加数组);
}

