import { 获取光标所在位置 } from '../../utils/rangeProcessor.js';
import { renderInstancies } from './package/loader.js';
import { 使用结巴拆分元素 } from '../../utils/tokenizer/jieba.js';
import { sac } from './runtime.js';
import { 输入事件发生在protyle内部 } from '../../utils/events/isIn.js';
import { 获取当前光标所在分词结果 } from '../../utils/rangeProcessor.js';
import { 更新并检查分词差异 } from '../../utils/tokenizer/diff.js';
import { 处理并显示tips } from './UI/render.js';
let tips容器数组 = []
export const 添加容器 = (element) => tips容器数组.push(element)
export let 上一个分词结果 = []
// 通用逻辑函数
function 创建编辑器上下文() {
    let { pos, editableElement, blockElement } = 获取光标所在位置();
    if (!editableElement) {
        return null;
    }
    let 分词结果数组 = 使用结巴拆分元素(editableElement);
    return {
        position: pos,
        text: editableElement.innerText,
        tokens: 分词结果数组,
        blockID: blockElement.getAttribute('data-node-id'),
        editableElement,
        logger: sac.logger
    };
}
//这样复制而不是全部复制是为了有机会大致检查一下
export let 显示tips = async (事件) => {
    if(!输入事件发生在protyle内部(事件)){
        return
    }
    //我现在有点怀疑自己是猪
    let 编辑器上下文= 创建编辑器上下文()
    const 是否有分词变化 = 更新并检查分词差异(编辑器上下文.tokens);
    if (!是否有分词变化) {
        return;
    }
    const 当前光标所在分词结果 = 获取当前光标所在分词结果(编辑器上下文.tokens, 编辑器上下文.position);
    if (!当前光标所在分词结果) {
        return;
    }
    编辑器上下文.currentToken = 当前光标所在分词结果;
    sac.statusMonitor.set('context', 'editor', 编辑器上下文);
    渲染所有容器的tips(编辑器上下文);
}
function 渲染所有容器的tips(编辑器上下文) {
    tips容器数组.forEach(async element => {
        renderInstancies.forEach(async renderInstance => {
            try {
                let asyncRender = async () => {
                    return await renderInstance.renderEditorTips(编辑器上下文);
                };
                let data= await asyncRender()
                if (!data) {
                    return;
                }
                处理并显示tips(data,element,编辑器上下文)
            } catch (e) {
                console.warn(e);
            }
        });
    });
}

