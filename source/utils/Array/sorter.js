/**
 * 根据指定的属性和排序算法对数组进行排序。
 * 排序算法可以是异步的。
 *
 * @param {Array} array - 需要排序的数组
 * @param {string} property - 用于排序的属性
 * @param {function} 排序算法 - 用于排序的算法，可以是异步的
 * @returns {Promise<Array>} 返回排序后的数组
 */
async function 根据项目属性排序数组(array, property, 排序算法) {
    // 使用map创建一个新数组，其中每个元素都包含原始元素和其属性值
    const mapped = array.map((el, i) => ({ index: i, value: el[property] }));
    // 使用提供的排序算法对新数组进行排序
    const sorted = await 排序算法(mapped);
    // 使用排序后的索引顺序返回原始数组的新顺序
    return sorted.map(el => array[el.index]);
}
function 通用排序(排序算法列表, 待排序数组) {
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

async function 随机化快速排序(待排序数组, 比较算法, 中断信号, 左索引 = 0, 右索引 = 待排序数组.length - 1) {
    if (左索引 < 右索引) {
        const 分割索引 = await 随机化分割(待排序数组, 比较算法, 左索引, 右索引);
        if (await 中断信号()) {
            throw new Error('排序被中断');
        }
        await 随机化快速排序(待排序数组, 比较算法, 中断信号, 左索引, 分割索引 - 1);
        await 随机化快速排序(待排序数组, 比较算法, 中断信号, 分割索引 + 1, 右索引);
    }
}

async function 随机化分割(待排序数组, 比较算法, 左索引, 右索引) {
    const 随机索引 = 左索引 + Math.floor(Math.random() * (右索引 - 左索引));
    [待排序数组[随机索引], 待排序数组[右索引]] = [待排序数组[右索引], 待排序数组[随机索引]];
    return await 分割(待排序数组, 比较算法, 左索引, 右索引);
}

// 全局缓存和变化追踪
let 上次排序结果 = [];
let 变化的索引 = new Set();

// 创建一个代理来追踪数组的变化
const 待排序数组代理 = new Proxy(上次排序结果, {
  set(target, property, value, receiver) {
    // 转换属性为数字索引
    const index = Number(property);
    if (!isNaN(index)) {
      变化的索引.add(index);
    }
    return Reflect.set(target, property, value, receiver);
  }
});

async function 缓存优化的随机化快速排序(比较算法, 中断信号) {
  // 如果没有变化，直接返回
  if (变化的索引.size === 0) {
    return;
  }

  // 获取变化部分的最小和最大索引
  let 变化的开始索引 = Math.min(...变化的索引);
  let 变化的结束索引 = Math.max(...变化的索引);

  // 对变化的部分进行排序
  await 随机化快速排序(待排序数组代理, 比较算法, 中断信号, 变化的开始索引, 变化的结束索引);

  // 清空变化追踪
  变化的索引.clear();
}

// 保持其他函数不变