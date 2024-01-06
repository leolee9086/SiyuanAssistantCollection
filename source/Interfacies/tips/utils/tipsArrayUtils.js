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



export function 排序待添加数组(待添加数组){
    待添加数组.sort((a, b) => {
        let timeDiff = 比较时间差(a, b);
        if (timeDiff > 1) {
            return b.time - a.time;
        } else {
            if (a.vectorScore !== b.vectorScore) {
                return 比较VectorScore(a, b);
            } else if (a.textScore !== b.textScore) {
                return 比较TextScore(a, b);
            } else {
                return 比较内容标记长度(a, b);
            }
        }
    });
}



// 比较时间差
function 比较时间差(a, b) {
    return Math.abs(a.time - b.time) / 1000;
}

// 比较 vectorScore
function 比较VectorScore(a, b) {
    return b.vectorScore - a.vectorScore;
}

// 比较 textScore
function 比较TextScore(a, b) {
    return b.textScore - a.textScore;
}

// 比较内容标记长度
function 比较内容标记长度(a, b) {
    let Amatch = a.content.match(/<mark>(.*?)<\/mark>|<span>(.*?)<\/span>/g);
    let Bmatch = b.content.match(/<mark>(.*?)<\/mark>|<span>(.*?)<\/span>/g);
    let aText = Amatch ? Amatch.join('') : '';
    let bText = Bmatch ? Bmatch.join('') : "";
    return bText.length - aText.length;
}
