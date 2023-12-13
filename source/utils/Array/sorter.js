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