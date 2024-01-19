import { sac } from '../../asyncModules.js';
import { 获取光标所在位置 } from '../rangeProcessor.js';
import { 使用结巴拆分元素 } from '../tokenizer/jieba.js';
import BlockHandler from '../BlockHandler.js';
import { 获取当前光标所在分词结果 } from '../rangeProcessor.js';
// 通用逻辑函数
export function 创建编辑器上下文() {
  let { pos, editableElement, blockElement } = 获取光标所在位置();
  if (!editableElement) {
    return null;
  }
  let 分词结果数组 = 使用结巴拆分元素(editableElement);
  const 当前光标所在分词结果 = 获取当前光标所在分词结果(分词结果数组, pos);
  return {
    position: pos,
    text: editableElement.innerText,
    tokens: 分词结果数组,
    blockID: blockElement.getAttribute('data-node-id'),
    editableElement,
    logger: sac.logger,
    currentToken:当前光标所在分词结果||undefined
  };
}
