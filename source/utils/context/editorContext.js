import { sac } from '../../asyncModules.js';
import { 获取光标所在位置 } from '../rangeProcessor.js';
import { 使用结巴拆分块元素 } from '../tokenizer/jieba.js';
import { 获取当前光标所在分词结果 } from '../rangeProcessor.js';
// 通用逻辑函数
/*export async function 创建编辑器上下文() {
  let { pos, editableElement, blockElement } = 获取光标所在位置();
  if (!editableElement) {
    return null;
  }
  // 使用代理延迟分词结果的生成，并确保结果生成后不再变化
  const 分词结果代理 = new Proxy({}, {
    get: async (target, property) => {
      if (property === 'tokens' && !target.tokens) {
        target.tokens = await 使用结巴拆分块元素(blockElement);
      }
      if (property === '当前光标所在分词结果' && !target.当前光标所在分词结果) {
        target.当前光标所在分词结果 = await 获取当前光标所在分词结果(target.tokens, pos);
      }
      return target[property];
    }
  });
  
  return {
    position: pos,
    text: editableElement.innerText,
    get tokens() {
      return 分词结果代理.tokens;
    },
    blockID: blockElement.getAttribute && blockElement.getAttribute('data-node-id'),
    editableElement,
    logger: sac.logger,
    get currentToken() {
      return 分词结果代理.当前光标所在分词结果;
    }
  };
}*/


export async function 创建编辑器上下文() {
  let { pos, editableElement, blockElement } = 获取光标所在位置();
  if (!editableElement) {
    return null;
  }

  // 直接异步获取分词结果
  const tokens = await 使用结巴拆分块元素(blockElement);
  // 直接异步获取当前光标所在分词结果
  const 当前光标所在分词结果 = await 获取当前光标所在分词结果(tokens, pos);
  let context = {
    position: pos,
    text: editableElement.innerText,
    tokens, // 直接赋值
    blockID: blockElement.getAttribute('data-node-id'),
    //  editableElement,
    currentToken: 当前光标所在分词结果, // 直接赋值
    blockDOM: blockElement.outerHTML,
    id:Lute.NewNodeID()
  };
  return context
}