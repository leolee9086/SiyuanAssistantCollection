import { 柯里化 } from "../../../utils/functionTools.js";
import { 比较时间差,比较TextScore,比较VectorScore,比较内容标记长度 } from "./sorters.js";
export const 构建空闲排序任务 = (tips数组, 比较算法) => {
    let idleCallbackHandle = null;
    let index = 1; // 初始化 index
  
    const start = () => {
      const performSort = (index) => {
        if (index < tips数组.length) {
          let key = tips数组[index];
          let j = index - 1;
  
          while (j >= 0 && 比较算法(tips数组[j], key) > 0) {
            tips数组[j + 1] = tips数组[j];
            j -= 1;
          }
          tips数组[j + 1] = key;
  
          idleCallbackHandle = requestIdleCallback(() => performSort(index + 1));
        }
      };
  
      performSort(index);
    };
  
    const stop = () => {
      if (idleCallbackHandle !== null) {
        cancelIdleCallback(idleCallbackHandle);
        idleCallbackHandle = null;
      }
      index = 1; // 重置 index 以便任务可以重新开始
    };
  
    // 清理函数，用于在任务结束时执行
    const cleanup = () => {
      stop(); // 停止当前任务
      // 这里可以添加其他清理代码
    };
  
    // 当任务完成时调用清理
    if (index >= tips数组.length) {
      cleanup();
    }
  
    return { start, stop };
  };



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
export const 排序待添加数组=(待添加数组)=>{
   let 排序函数 = 柯里化(通用排序)([
    比较时间差,
    比较VectorScore,
    比较TextScore,
    比较内容标记长度,
   ])
   排序函数(待添加数组)
}


