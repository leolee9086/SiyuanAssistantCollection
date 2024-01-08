import { showTips } from './UI/render.js';
import { 获取光标所在位置 } from '../../utils/rangeProcessor.js';
import { 计算分词差异 } from '../../utils/tokenizer/diff.js';
import { renderInstancies } from './package/loader.js';
import { 使用结巴拆分元素 } from '../../utils/tokenizer/jieba.js';
import { sac } from './runtime.js';
import { hasClosestBlock } from '../../utils/DOMFinder.js';
import { 输入事件发生在protyle内部 } from '../../utils/events/isIn.js';
let containers = []
export const 添加容器 = (element) => containers.push(element)
let 上一个分词结果 = []
export let 显示tips = async (e) => {
    console.log(e)
    if(!输入事件发生在protyle内部(e)){
        return
    }
    let { pos, editableElement, blockElement, parentElement } = 获取光标所在位置();
    if (!editableElement) {
        return;
    }
    let 分词结果数组 = 使用结巴拆分元素(editableElement);
    let 当前光标所在分词结果数组 = 分词结果数组.filter((token) => {
        return (token.start <= pos && token.end >= pos) && (token.word && token.word.trim().length > 1);
    }).sort((a, b) => {
        return b.word.length - a.word.length;
    });
    if (计算分词差异(分词结果数组, 上一个分词结果) >= 0) {
        上一个分词结果 = 分词结果数组;
    } else {
        return;
    }
    if (!分词结果数组[0]) {
        return;
    }
    if (!当前光标所在分词结果数组[0]) {
        return;
    }
    let editorContext = {
        position: pos,
        text: editableElement.innerText,
        tokens: 分词结果数组,
        currentToken: 当前光标所在分词结果数组[0],
        blockID: blockElement.getAttribute('data-node-id'),
        editableElement
    };
    sac.statusMonitor.set('context', 'editor', editorContext)
    containers.forEach(
        element => {
            renderInstancies.forEach(
                renderInstance => {
                    try {
                        let asyncRender = async () => {
                            return await renderInstance.renderEditorTips(editorContext);
                        };

                        asyncRender().then(data => {
                            //如果有返回值就渲染
                            if (!data) {
                                return;
                            }
                            data.source = renderInstance.name;
                            data.item.forEach(
                                item => {
                                    item.targetBlocks = [editorContext.blockID];
                                    item.source = renderInstance.name;
                                    item.type = 'keyboardTips'
                                }
                            );

                            showTips(data, element, editorContext)

                        });
                    } catch (e) {
                        console.warn(e);
                    }
                }
            );
        }
    );
}