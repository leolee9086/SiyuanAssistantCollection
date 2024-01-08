/**
 * 根据指定的属性和排序算法对数组进行排序。
 * 排序算法可以是异步的。
 *
 * @param {Array} array - 需要排序的数组
 * @param {string} property - 用于排序的属性
 * @param {function} sortAlgorithm - 用于排序的算法，可以是异步的
 * @returns {Promise<Array>} 返回排序后的数组
 */
async function sortArrayByProperty(array, property, sortAlgorithm) {
    // 使用map创建一个新数组，其中每个元素都包含原始元素和其属性值
    const mapped = array.map((el, i) => ({ index: i, value: el[property] }));

    // 使用提供的排序算法对新数组进行排序
    const sorted = await sortAlgorithm(mapped);

    // 使用排序后的索引顺序返回原始数组的新顺序
    return sorted.map(el => array[el.index]);
}
function 通用排序(排序算法列表,待排序数组) {
    待排序数组.sort((a, b) => {
        for (let i = 0; i < 排序算法列表.length; i++) {
            const 排序算法 = 排序算法列表[i];
            let 排序结果;
            try {
                排序结果 = 排序算法(a, b);
                // 确保排序结果是一个数字
                if (typeof 排序结果 !== 'number') {
                    throw new Error(`排序算法 "${排序算法.name}" 没有返回数字类型的结果`);
                }
            } catch (error) {
                console.error(error.message);
                // 忽略这个排序算法，继续下一个
                continue;
            }
            // 如果排序结果不为0，则直接返回结果
            if (排序结果 !== 0) {
                return 排序结果;
            }
            // 如果排序结果为0，则继续使用下一个排序算法
        }
        // 所有排序算法比较结果都为0，则认为两个元素相等，返回0
        return 0;
    });
}