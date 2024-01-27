import { 获取选区屏幕坐标 } from '../../utils/rangeProcessor.js';
import { renderInstancies } from './package/loader.js';
import { sac } from './runtime.js';
import { 更新并检查分词差异 } from '../../utils/tokenizer/diff.js';
import { 处理并显示tips } from './UI/render.js';
import { 智能防抖, 柯里化 } from '../../utils/functionTools.js';
import { 在空闲时间执行任务 } from '../../utils/functionAndClass/idleTime.js';
import { text2vec } from '../../Processors/AIProcessors/publicUtils/endpoints.js';
import { 创建编辑器上下文 } from '../../utils/context/editorContext.js';
import { withPerformanceLogging } from '../../utils/functionAndClass/performanceRun.js';
let 键盘tips数组 = []
sac.statusMonitor.set('tips', 'current', 键盘tips数组)
export let 上一个分词结果 = []
let 小字元素 = document.createElement('div');

async function 显示光标提示(编辑器上下文) {
  // 创建新的 HTML 元素
  小字元素.textContent = await sac.statusMonitor.get('meta', 'tokens').$value.size
  小字元素.style.position = 'fixed';
  小字元素.style.color = 'gray';
  小字元素.style.fontSize = 'small';
  // 获取光标所在位置的坐标
  let 光标坐标 = 获取选区屏幕坐标(编辑器上下文.editableElement);
  // 设置元素的位置
  小字元素.style.left = `${光标坐标.left}px`;
  小字元素.style.top = `${光标坐标.top}px`;
  // 将元素添加到文档中
  document.body.appendChild(小字元素);
}
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

  if (!flag) {
    if (任务生成中) {
      console.log("上一轮任务还在生成中")
      return
    }
    任务生成中 = true

    await 创建编辑器上下文并触发任务生成(signal)
    任务生成中= false
  }

}
let 创建编辑器上下文并触发任务生成 =async (signal) => {
  if (signal.aborted) {
    console.log('aborted')
    return
  }
  let 编辑器上下文 = await(withPerformanceLogging(创建编辑器上下文))()
  if (编辑器上下文) {
    显示光标提示(编辑器上下文, "测试")
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
  if (更新并检查分词差异(编辑器上下文.tokens)) {
    (async () => {
      if (正在生成编辑器向量) {
        // 如果已经有一个任务在执行，则直接返回
        return;
      }
      try {
        let res = await text2vec(编辑器上下文.editableElement.innerText);
        if (signal.aborted) {
          正在生成编辑器向量 = false; // 释放锁
          return
        }
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
  let 任务队列 = 创建任务队列(编辑器上下文, renderInstancies).map(
    任务信息 => {
      return () => {
        if (signal.aborted) {
          return
        }
        任务信息.执行()
      }
    }
  )
  在空闲时间执行任务(任务队列)
}
// 创建任务队列的函数
function 创建任务队列(编辑器上下文, renderInstancies, 编辑器上下文特征向量) {
  const { position, text, tokens, blockID, editableElement, logger, currentToken } = 编辑器上下文;
  const editableElementID = editableElement.getAttribute('id');
  const 编辑器上下文信息 = {
    position,
    text,
    tokens: [...tokens],
    blockID,
    editableElementID,
    logger,
    currentToken,
  };
  return renderInstancies.map(renderInstance => {
    const 添加时间 = Date.now();
    const renderInstanceName = renderInstance.name;
    return {
      添加时间,
      执行: () => requestIdleCallback(() => 执行任务(renderInstance, 编辑器上下文, 编辑器上下文特征向量)),
      来源: renderInstanceName,
      编辑器上下文信息,
      类型: "编辑器tips"
    };
  })
}
let 触发条件表 = [
  {
    name: 'renderEditorTips',
    assert: (renderInstance, 编辑器上下文) => { return 编辑器上下文 && !编辑器上下文.vector },
  },
  {
    name: "renderEditorVectorTips",
    assert: (renderInstance, 编辑器上下文) => { return 编辑器上下文.vector }
  }
]
// 将函数拆分为两个部分：触发条件检查和任务执行
// 触发条件检查函数
async function 检查触发条件(renderInstance, 编辑器上下文,) {
  for (const 触发条件 of 触发条件表) {
    const { name, assert } = 触发条件;
    const conditionMet = await assert(renderInstance, 编辑器上下文);
    if (renderInstance[name] && conditionMet) {
      return name; // 返回满足条件的触发条件名称
    }
  }
  return null; // 如果没有条件满足，返回null
}
// 任务执行函数
async function 执行任务(renderInstance, 编辑器上下文) {
  const 显示tips = 柯里化(处理并显示tips)(renderInstance)(编辑器上下文);
  try {
    const 生成器名称 = await 检查触发条件(renderInstance, 编辑器上下文);
    if (生成器名称) {
      try {
        const 防抖生成tips = 智能防抖(renderInstance[生成器名称].bind(renderInstance));
        const data = await 防抖生成tips(编辑器上下文);
        //const data = withPerformanceLogging(renderInstance[生成器名称].bind(renderInstance))(编辑器上下文)
        if (data) {
          data.source = renderInstance.name;
          显示tips(data);
        }
      } catch (e) {
        sac.logger.tipsWarn(renderInstance.name, e);
      }
    }
  } catch (e) {
    sac.logger.tipsWarn(renderInstance.name, e);
  }
}