import { renderInstancies } from './package/loader.js';
import { sac } from './runtime.js';
import { 更新并检查分词差异 } from '../../utils/tokenizer/diff.js';
import { 在空闲时间执行任务 } from '../../utils/functionAndClass/idleTime.js';
import { text2vec } from '../../Processors/AIProcessors/publicUtils/endpoints.js';
import { 创建编辑器上下文 } from '../../utils/context/editorContext.js';
import { 创建任务队列 } from './task.js';
import {显示光标提示菜单} from './UI/tipsContextMenu.js'
let 键盘tips数组 = []
sac.statusMonitor.set('tips', 'current', 键盘tips数组)
export let 上一个分词结果 = []
//这样复制而不是全部复制是为了有机会大致检查一下
let signal = {}
let abortController = null;
//这个全局变量是给自己用的,signal是为了更方便传递
let 任务生成中 = false
export let 显示actions并生成tips渲染任务 = async (flag) => {
  if (abortController) {
    abortController.abort();
  }
  // 为当前任务创建一个新的AbortController
  abortController = new AbortController();
  signal = abortController.signal;
  显示光标提示菜单(signal)
  if (!flag) {
    if (任务生成中) {
      console.log("上一轮任务还在生成中")
      return
    }
    任务生成中 = true
    try {
      await 创建编辑器上下文并触发任务生成(signal)
    } catch (e) {
      console.error(e)
    }
    任务生成中 = false
  }
}

let 创建编辑器上下文并触发任务生成 = async (signal) => {
  if (signal.aborted) {
    return
  }
  let 编辑器上下文 = await 创建编辑器上下文()
  if (编辑器上下文) {
    requestIdleCallback(() => 生成tips渲染任务(编辑器上下文, signal))
  }
  任务生成中 = false
}

let 正在生成编辑器向量
async function 生成tips渲染任务(编辑器上下文, signal) {
  sac.statusMonitor.set('context', 'editor', 编辑器上下文);
  if (signal.aborted) {
    return
  }
  //因为向量检索的成本比较高,所以只有在编辑器编辑步数差异大于一定条件的时候重新生成
  //这里之后可能需要暴露一个设置
  if (更新并检查分词差异(await 编辑器上下文.tokens)) {
    (async () => {
      if (正在生成编辑器向量) {
        // 如果已经有一个任务在执行，则直接返回
        return;
      }
      try {
        let res = await text2vec(编辑器上下文.text);

        if (res.body && res.body.data) {
          sac.logger.tipsInfo(`特征向量生成成功,将用于查询`);
          编辑器上下文.vector = res.body.data[0].embedding;
        } else {
          console.error(res);
        }
      } catch (error) {
        console.error('向量生成任务出错:', error);
      } finally {
        正在生成编辑器向量 = false; // 释放锁
      }
    })()
  }
  // 创建并执行tips渲染任务队列(编辑器上下文);
  let 任务队列 = await 创建任务队列(编辑器上下文, renderInstancies, signal)
  在空闲时间执行任务(任务队列)
}


