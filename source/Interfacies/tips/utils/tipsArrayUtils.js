import { 修正评分, scoreItem } from "./rater.js";
import { getCurrentEditorContext } from "./context.js";
import { BM25 } from "../../../utils/text/bm25.js";

let bm25 = new BM25()
export const 排序待添加数组 = async (待添加数组) => {
  let baseString = await getCurrentEditorElementContent();
  let startTime = performance.now();
  let threshold = 50; // 设置50毫秒作为性能阈值
  // 一次遍历来初始化scores并计算scores.time
  for (let item of 待添加数组) {
    bm25.addDocument(item, ['description', 'link']);
    let currentTime = performance.now();
    if (currentTime - startTime > threshold) {
      // 如果添加时间超过阈值，停止添加
      break;
    }
  }
  const bm25scores = bm25.query(baseString);
  let endTime = performance.now();
  if (endTime - startTime > 100) {
    // 如果BM25评分耗时超过100毫秒，清空BM25实例
    bm25 = new BM25(); // 重置BM25实例
    return; // 提前返回，不再继续执行后续代码
  }
  for (let item of 待添加数组) {
    if (!item.scores) {
      item.scores = {}; // 初始化scores对象
    }
    await scoreItem(item, baseString, bm25scores);
  }
  try {
    修正评分(待添加数组);
  } catch (e) {
    console.error(e);
  }
  // 现在数组中的每个item都有了scores属性，可以进行排序
  待添加数组.sort((a, b) => {
    if (a.pined !== b.pined) {
      return a.pined ? -1 : 1;
    } else {
      return b.score - a.score;
    }
  });
  return 待添加数组
};

function getCurrentEditorElementContent() {
  let editorContext = getCurrentEditorContext()
  if (editorContext && editorContext.editableElement) {
    return editorContext.editableElement.innerText || ""
  } else {
    return ""
  }
}
