import { 柯里化 } from "../../../utils/functionTools.js";
import { 比较时间差并归一化,比较TextScore,比较VectorScore,比较内容标记长度并归一化 } from "./sorters.js";
import { fixScore,scoreItem } from "./rater.js";
import { getCurrentEditorContext } from "./context.js";
const 构建空闲排序任务 = (tips数组, 比较算法) => {
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


  export const 排序待添加数组 = (待添加数组) => {
    let baseString  = getCurrentEditorElementContent()
    // 一次遍历来初始化scores并计算scores.time
    待添加数组.forEach(item => {
      if (!item.scores) {
        item.scores = {}; // 初始化scores对象
      }
      scoreItem(item,baseString)
    });
    //fixScore(待添加数组)

    // 现在数组中的每个item都有了scores属性，可以进行排序
    // 使用sort方法进行排序，这是内部的遍历，我们无法优化这部分
    待添加数组.sort((a, b) => b.score- a.score);
  };
  function getCurrentEditorElementContent(){
    let editorContext = getCurrentEditorContext()
    if(editorContext&&editorContext.editableElement){
      return editorContext.editableElement.innerText||""
    }else{
      return ""
    }
  }
