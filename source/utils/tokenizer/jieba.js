import * as jieba from '../../../static/jieba_rs_wasm.js'
import { 创建token对象 } from "../DOMTokenizer.js";
import { 校验分词是否连续, 校验是否包含 } from './utils.js';
import fs from '../../polyfills/fs.js';
//结巴的初始化会造成问题
await jieba.default(import.meta.resolve('../../../static/jieba_rs_wasm_bg.wasm'))
let dict
try {
  try {
    dict = await fs.readFile('/data/public/sac-tokenizer/dict.txt')
    dict = dict.split('\n')
    dict.forEach(
      word => {
        word && jieba.add_word(word)
      }
    )
  } catch (e) {
    console.warn(e)
  }

} catch (e) {
  console.warn(e)
}

jieba.add_word('思源笔记')
jieba.add_word('链滴')
export { jieba as jieba }
export { jieba as 结巴 }
export {dict as dict}
let tokenize = jieba.tokenize
export { tokenize as tokenize }
export async function 使用结巴拆分块元素(element) {
  //首先用结巴进行全分词
  let 分词结果数组 = await tokenize(element.textContent, "search")
  //然后对分词产生的每一个结果创建range
  let tokens = []
  for (let 分词结果 of 分词结果数组) {
    let token = await 创建token对象(element, 分词结果)
    tokens.push(token)
  }
  //创建token之间的父子关系和前后关系
  await 处理分词对象(tokens)
  return tokens
}
function 处理分词对象(分词对象序列) {
  分词对象序列.forEach((当前分词对象, i) => {
    let foundNext = false;
    for (let j = i + 1; j < 分词对象序列.length; j++) {
      const 下一个分词对象 = 分词对象序列[j];
      if (!foundNext && 校验分词是否连续(当前分词对象, 下一个分词对象)) {
        当前分词对象.next = 下一个分词对象.id;
        下一个分词对象.pre = 当前分词对象.id;
        foundNext = true;
      }
      if (校验是否包含(当前分词对象, 下一个分词对象)) {
        当前分词对象.children = 当前分词对象.children || [];
        当前分词对象.children.push(下一个分词对象);
      }
    }
  });
}