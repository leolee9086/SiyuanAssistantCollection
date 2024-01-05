import * as jieba from '../../../static/jieba_rs_wasm.js'
import { 创建token对象 } from "../DOMTokenizer.js";
import { 校验分词是否连续,校验是否包含 } from './utils.js';
//结巴的初始化会造成问题
await jieba.default(import.meta.resolve('../../static/jieba_rs_wasm_bg.wasm'))
jieba.add_word('思源笔记')
jieba.add_word('链滴')

export {jieba as jieba}
export {jieba as 结巴}
export function  使用结巴拆分元素(element) {
    //首先用结巴进行全分词
    let 分词结果数组 = jieba.tokenize(element.textContent, "search")
    //然后对分词产生的每一个结果创建range
    let tokens = []
    分词结果数组.forEach(
        分词结果 => {
            let token = 创建token对象(element, 分词结果)
            tokens.push(token)
        }
    )
    //创建token之间的父子关系和前后关系
    处理分词对象(tokens)
    return tokens
}
function 处理分词对象(分词对象序列) {
    for (let i = 0; i < 分词对象序列.length; i++) {
        const 当前分词对象 = 分词对象序列[i];
        for (let j = i + 1; j < 分词对象序列.length; j++) {
            const 下一个分词对象 = 分词对象序列[j];
            if (校验是否包含(当前分词对象, 下一个分词对象)) {
                // 如果一个 token 完全在另一个 token 中，则将它添加到那个 token 的 children 数组中
                if (!当前分词对象.children) {
                    当前分词对象.children = [];
                }
                当前分词对象.children.push(下一个分词对象);
            } else if (校验分词是否连续(当前分词对象, 下一个分词对象)) {
                // 如果一个 token 紧接在另一个 token 之后，则设置它们的 pre 和 next 属性
                当前分词对象.next = 下一个分词对象;
                下一个分词对象.pre = 当前分词对象;
                break; // 跳出内层循环，继续处理下一个 token
            }
        }
    }
}
