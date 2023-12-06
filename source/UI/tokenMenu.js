import { clientApi, pluginInstance as plugin } from "../asyncModules.js";
import { 
  获取光标所在位置, 
  使用结巴拆分元素,
  logger 
} from ".runtime.js";
import { 智能防抖 } from "../utils/functionTools.js"
import { 根据上下文获取动作表 } from '../actionList/getter.js'
import kernelApi from "../polyfills/kernelApi.js";
import { Context } from "./Context.js";
import buildMenu from './dialogs/fakeMenu.js'
import { logger } from "../logger/index.js";
import { 设置对话框 } from "./dialogs/settingsDialog.js";
export { 根据上下文获取动作表 as 根据上下文获取动作表 }

plugin.eventBus.on(
  "settingChange", (e) => {
    let tokenMenuDialogs = plugin.statusMonitor.get('菜单', '关键词菜单', '菜单实例').$value
    let { detail } = e
    if (detail.name === "动作设置.关闭动作监听") {
      if (detail.value) {
        tokenMenuDialogs[0].destroy()
      } else {
        buildMenu("SAC")
      }
    }
  }
)
function 获取元素所在protyle(element) {
  let { protyles } = plugin
  logger.tokenmenulog(protyles)
  let protyle = protyles.find(protyle => {
    return protyle.contentElement ? protyle.contentElement.contains(element) : protyle.protyle.contentElement.contains(element)
  })
  return protyle.protyle ? protyle.protyle : protyle
}
let isComposing = false;
//这一段是token菜单的渲染逻辑
//记录选区位置,如果发生了变化就不再执行后面的逻辑
let controller = new AbortController();
let signal = controller.signal

let 显示token菜单 = (e, signal) => {
  let tokenMenuDialogs = plugin.statusMonitor.get('菜单', '关键词菜单', '菜单实例').$value
  if (!tokenMenuDialogs[0]) {
    return
  }
  let tokenMenuDialog = tokenMenuDialogs[0]
  tokenMenuDialog.clear()
  //上下方向键不重新渲染菜单
  if (signal.aborted) {
    return
  }
  if (!plugin.块数据集) {
    return
  }
  //如果不是在编辑器里就不渲染了
  const 最近块元素 = plugin.DOM查找器.hasClosestBlock(
    getSelection().getRangeAt(0).commonAncestorContainer
  );
  if (!最近块元素) {
    return
  }
  let block = new plugin.utils.BlockHandler(最近块元素.dataset.nodeId)
  //这个是用来获取光标处token的
  let { pos, editableElement, blockElement, parentElement } = 获取光标所在位置();
  let 分词结果数组 = 使用结巴拆分元素(editableElement).filter((token) => {
    return (token.start <= pos && token.end >= pos) && (token.word && token.word.trim().length > 1);
  }).sort((a, b) => {
    return b.word.length - a.word.length
  });
  if (!分词结果数组[0]) {
    return
  }
  分词结果数组.pos = pos
  分词结果数组.editableElement = editableElement
  分词结果数组.parentElement = parentElement
  分词结果数组.blockElement = blockElement
  分词结果数组.protyle = 获取元素所在protyle(blockElement)
  if (!获取光标底部位置()) {
    return
  }
  const range = getSelection().getRangeAt(0);
  const 选区位置 = plugin.选区处理器.获取选区屏幕坐标(最近块元素, range);
  plugin.lastTokenArray = 分词结果数组
  let protyle = 获取元素所在protyle(最近块元素)
  //创建一个临时文档片段元素以加快渲染速度
  分词结果数组.forEach(
    async (分词结果) => {
      console.log(protyle)
      let 执行上下文 = new Context([block], 分词结果, protyle.getInstance(), tokenMenuDialog, plugin, kernelApi, clientApi, 'blockAction_token', 分词结果数组)
      let 备选动作表 = await 根据上下文获取动作表(执行上下文, signal)
      //这一步排序对性能的影响微乎其微
      let 菜单动作表 = 备选动作表.filter(item => { return item.hintAction })
      let tips动作表 = 备选动作表.filter(item => { return item.tipRender })
      plugin.eventBus.emit('hint_tips', { 备选动作表: tips动作表, context: 执行上下文 })
      let 动作菜单组 = 根据动作序列生成菜单组(菜单动作表, 执行上下文, '分词菜单')
      tokenMenuDialog.moveTo({
        x: 选区位置.left + 10,
        y: 获取光标底部位置(),
        isLeft: false,
      })

      tokenMenuDialog.element.querySelector("#sacmenu").appendChild(动作菜单组)
    }
  )
}

export function findTokenElement(current, range) {
  if (current.nodeType === 1 && current.classList.contains("token")) {
    return current;
  }
  if (current.childNodes.length > 0) {
    for (let i = 0; i < current.childNodes.length; i++) {
      const child = current.childNodes[i];
      const tokenElement = findTokenElement(child, range);
      if (tokenElement) {
        return tokenElement;
      }
    }
  }
  if (range.startContainer === current || range.endContainer === current) {
    return current.parentElement;
  }
  return null;
}
function 获取光标底部位置() {
  const selection = window.getSelection();
  if (!selection.rangeCount) return null;
  const range = selection.getRangeAt(0);
  const rect = range.getClientRects()[0];
  return rect ? rect.bottom : null;
}




const 根据上下文生成动作菜单项 = (执行上下文, 动作, 触发事件类型) => {
  let 菜单项文字内容 = 动作.label[window.siyuan.config.lang] || 动作.label.zh_CN || 动作.label
  if (菜单项文字内容 instanceof Function) {
    菜单项文字内容 = 动作.label(执行上下文)
    菜单项文字内容 = 菜单项文字内容[window.siyuan.config.lang] || 菜单项文字内容.zh_CN || 菜单项文字内容
  }
  let span = `<svg class="b3-menu__icon" style="">
  <use xlink:href="#${Lute.EscapeHTMLStr(动作.icon)}"></use>
</svg>
<span class="b3-menu__label"
style='  display: inline-block;
width: 200px; 
white-space: nowrap; 
overflow: hidden;
text-overflow: ellipsis; 

'
>${菜单项文字内容}</span>`
  let div = `<div><svg class="b3-menu__icon" style="">
<use xlink:href="#${Lute.EscapeHTMLStr(动作.icon)}"></use>
</svg>
<span class="b3-menu__label"
style='  display: inline-block;
width: 200px; 
white-space: nowrap; 
overflow: hidden;
text-overflow: ellipsis; 

'
>${菜单项文字内容}</span></div> <div class="b3-label__text">${动作.describe}</div>}`
  let 菜单项元素 = 以tag名生成元素(
    'button',
    {
      class: "b3-menu__item"
    },
    动作.describe ? div : span
    ,
    {
      click: () => { 执行动作(动作, 执行上下文, 触发事件类型) },
      contextmenu: () => {
        let list = {}
        list[动作.provider] = true
        设置对话框(list, `动作设置.关键词动作设置`)
      }
    }
  )
  菜单项元素.token = 执行上下文.token
  菜单项元素.active = 动作.active
  菜单项元素.deactive = 动作.deactive
  菜单项元素.runAction = () => {
    执行动作(动作, 执行上下文, '分词菜单')
  }
  return 菜单项元素
}
const 执行动作 = async (动作, 执行上下文, 触发事件类型) => {
  if (触发事件类型 == '分词菜单') {
    if (动作.hintAction) {
      await 动作.hintAction(执行上下文);
    } else if (动作.分词动作) {
      await 动作.分词动作(执行上下文);
    }
  } else {
    if (动作.blockAction) {
      await 动作.blockAction(执行上下文);
    } else if (动作.块动作) {
      await 动作.块动作(执行上下文);
    }
  }
  plugin.命令历史.push(动作);
  动作.lastContext = 执行上下文;
}
//对命令进行排序
//Levenshtein距离是一种用于计算两个字符串之间的相似度的算法。
//它衡量了将一个字符串转换为另一个字符串所需的最少编辑操作次数，包括插入、删除和替换字符。
export function 根据动作序列生成菜单组(动作序列, 执行上下文, 触发事件类型) {
  let 子菜单元素片段 = document.createDocumentFragment();
  动作序列.forEach(
    (动作) => {
      try {
        let 动作菜单项 = 根据上下文生成动作菜单项(执行上下文, 动作, 触发事件类型)
        //如果动作曾经执行缓慢,就给个提示
        if (plugin.statusMonitor.get('动作表状态', 动作._provider).$value === "slow") {
          动作菜单项.style.color = '--b3-card-warning-color'
        }
        子菜单元素片段.appendChild(动作菜单项)
      } catch (e) {
        logger.tokenmenuerror(执行上下文, 动作, e)
      }
    }
  )
  return 子菜单元素片段
}
function 以tag名生成元素(tag名, 属性配置, 内部html, 事件配置) {
  let 元素 = document.createElement(tag名)
  Object.getOwnPropertyNames(属性配置).forEach(
    prop => {
      元素.setAttribute(prop, 属性配置[prop])
    }
  )
  Object.getOwnPropertyNames(事件配置).forEach(
    事件名 => {
      元素.addEventListener(事件名, 事件配置[事件名])
    }
  )
  元素.insertAdjacentHTML('beforeEnd', 内部html)
  return 元素
}
export const 开始渲染 = () => {
  buildMenu("SAC")
  document.addEventListener('compositionstart', () => {
    //isComposing = true;
  },
    { capture: true });
  document.addEventListener(
    "keydown",
    (e) => {
      controller.abort()
      controller = new AbortController();
      signal = controller.signal
      let tokenMenuDialogs = plugin.statusMonitor.get('菜单', '关键词菜单', '菜单实例').$value
      if (!tokenMenuDialogs[0]) {
        return
      }
      let tokenMenuDialog = tokenMenuDialogs[0]
      if (e.code && (e.code === "ArrowUp" || e.code === "ArrowDown")) {
        let altFlag = !plugin.configurer.get('动作设置', '上下键选择动作').$value ? e.altKey : !e.altKey
        if (altFlag && !e.repeat) {
          tokenMenuDialog.switchCurrent(e.code)
          e.preventDefault()
          e.stopPropagation()
          return
        }
      }

      if (e.code && (e.code === "Space" && plugin.configurer.get('动作设置', '空格键调用动作').$value)) {
        console.log(e)

        let items = Array.from(tokenMenuDialog.element.querySelectorAll('.b3-menu__item'));
        let currentIndex = items.findIndex(item => item.classList.contains('b3-menu__item--current'));
        // 如果有选中的菜单项
        if (currentIndex !== -1) {
          // 触发选中的菜单项
          items[currentIndex].click();
          e.preventDefault();
          e.stopPropagation();
        }
        tokenMenuDialog.clear()
      }
      if (e.code === "Enter" && e.altKey) {
        let items = Array.from(tokenMenuDialog.element.querySelectorAll('.b3-menu__item'));
        let currentIndex = items.findIndex(item => item.classList.contains('b3-menu__item--current'));
        // 如果有选中的菜单项
        if (currentIndex !== -1) {
          // 触发选中的菜单项
          items[currentIndex].click();
          e.preventDefault();
          e.stopPropagation();
        }
        tokenMenuDialog.clear()
      }
      if (!isComposing) {
        // 触发事件的逻辑
        setTimeout(() => {
          显示token菜单(e, signal)
        }, 0)
      }
    },
    { capture: true }
  )
  // 监听 compositionend 事件
  document.addEventListener('compositionend', (e) => {
    let tokenMenuDialogs = plugin.statusMonitor.get('菜单', '关键词菜单', '菜单实例').$value
    if (!tokenMenuDialogs[0]) {
      return
    }
    let tokenMenuDialog = tokenMenuDialogs[0]
    isComposing = false;
    controller.abort()
    controller = new AbortController();
    signal = controller.signal
    if (!tokenMenuDialog) {
      return
    }
    setTimeout(() => {
      显示token菜单(e, signal)
    }, 0)

  },
    { capture: true });
}

