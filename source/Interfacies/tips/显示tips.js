import { 获取光标所在位置 } from '../../utils/rangeProcessor.js';
import { renderInstancies } from './package/loader.js';
import { 使用结巴拆分元素 } from '../../utils/tokenizer/jieba.js';
import { sac } from './runtime.js';
import { 获取当前光标所在分词结果 } from '../../utils/rangeProcessor.js';
import { 更新并检查分词差异 } from '../../utils/tokenizer/diff.js';
import { 处理并显示tips } from './UI/render.js';
import { 柯里化 } from '../../utils/functionTools.js';
import { 在空闲时间执行任务 } from '../../utils/functionAndClass/idleTime.js';
let 键盘tips数组 = []
sac.statusMonitor.set('tips', 'current', 键盘tips数组)
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
export let 显示tips = async () => {

    //我现在有点怀疑自己是猪
    let 编辑器上下文 = 创建编辑器上下文()
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
   // 创建并执行tips渲染任务队列(编辑器上下文);
   let 任务队列= 创建任务队列(编辑器上下文,renderInstancies).map(
    任务信息=>{
        return 任务信息.执行
    }
   )
   在空闲时间执行任务(任务队列)
}
// 创建任务队列的函数
function 创建任务队列(编辑器上下文, renderInstancies) {
    const { position, text, tokens, blockID, editableElement, logger, currentToken } = 编辑器上下文;
    const editableElementID = editableElement.getAttribute('id');
    const 编辑器上下文信息 = {
        position,
        text,
        tokens: [...tokens],
        blockID,
        editableElementID,
        logger,
        currentToken
    };
    return renderInstancies.map(renderInstance => {
        const 添加时间 = Date.now();
        const renderInstanceName = renderInstance.name;
        return {
            添加时间,
            执行: () => 执行任务(renderInstance, 编辑器上下文),
            来源: renderInstanceName,
            编辑器上下文信息,
            类型: "编辑器tips"
        };
    })
}

// 执行任务的函数
async function 执行任务(renderInstance, 编辑器上下文) {
    const $处理并显示tips = 柯里化(处理并显示tips)(编辑器上下文);
    try {
        let data = await renderInstance.renderEditorTips(编辑器上下文);
        if (data) {
            data.source = renderInstance.name;
            $处理并显示tips(data);
        }
    } catch (e) {
        console.warn(e);
    }
}
