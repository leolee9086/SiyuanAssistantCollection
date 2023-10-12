import { Context } from "../Context.js";
import { plugin, clientApi, kernelApi } from "../index.js";
import BlockHandler from '../../utils/BlockHandler.js'
import { 根据上下文获取动作表, 根据动作序列生成菜单组 } from "../tokenMenu.js";
import { 动作总表 } from "../../actionList/index.js";
import path from '../../polyfills/path.js'
let 已监听菜单元素 = []
let currentHintAction
export const 监听菜单选中项变化 = (菜单, 选中回调函数, 反选回调函数) => {
  if (!已监听菜单元素.includes(menu.menu.element)) {
    const observer = new MutationObserver((mutationsList, observer) => {
      // 在这里处理选中值变化的逻辑
      const 选中项 = 菜单.menu.element.querySelector('.b3-menu__item--current');
      currentHintAction = 选中项
      菜单.menu.element.querySelectorAll('.b3-menu__item:not(.b3-menu__item--current)').forEach(
        item => {
          if (item !== 选中项) {
            反选回调函数(菜单, item)
          }
        }
      );
      选中回调函数(菜单, 选中项)
    });
    observer.observe(菜单.menu.element, { attributes: true, subtree: true });
    已监听菜单元素.push(menu.menu.element)
  }
}

export const 生成元素 = (type, obj, html, events) => {
  let button = document.createElement(type)
  Object.getOwnPropertyNames(obj).forEach(
    prop => {
      button.setAttribute(prop, obj[prop])
    }
  )
  Object.getOwnPropertyNames(events).forEach(
    event => {
      button.addEventListener(event, events[event])
    }
  )
  button.insertAdjacentHTML('beforeEnd', html)
  return button
}




function 从块标菜单事件获取块列表(event) {
  let blocks = [];
  if (event.detail.data) {
    let _block = event.detail.data;
    console.log(event.detail.data)
    blocks = [new BlockHandler(_block.id)];
  } else if (event.detail.blockElements) {
    event.detail.blockElements.forEach((element) => {
      let _block = {
        id: element.dataset.nodeId,
      };
      blocks.push(new BlockHandler(_block.id));
    });
  }
  return blocks
}

export function 渲染块标菜单(event, eventType) {
  let { menu, protyle } = event.detail;
  let blocks = 从块标菜单事件获取块列表(event)
  let label = "执行动作"
  let label1
  let context1 = {}
  let context = new Context(blocks, null, protyle, menu, plugin, kernelApi, clientApi, eventType);
  if (
    event.detail.blockElements &&
    event.detail.blockElements[0].dataset.type == "NodeBlockQueryEmbed" &&
    !event.detail.blockElements[1]
  ) {
    let 嵌入块元素数组 = event.detail.blockElements[0].querySelectorAll(
      ".protyle-wysiwyg__embed>[data-node-id]"
    );
    if (嵌入块元素数组[0]) {
      let _blocks = [];
      嵌入块元素数组.forEach((element) => {
        _blocks.push(
          new BlockHandler(element.dataset.nodeId)
        );
      });
      context1 = {
        blocks: _blocks,
        token: null,
        protyle: protyle,
        menu: menu,
        plugin: plugin,
        kernelApi: kernelApi,
        clientApi: clientApi,
        eventType: eventType + 'emedContent'
      }
    }
    label1 = '对所有嵌入块所有目标执行动作'
  }
  let divs = []
  let div1 = document.createElement('div');
  let submenu = [

  ];
  console.log(动作总表)
  let 路径组 = []
  动作总表.forEach(
    动作表 => {
      let 文件名 = path.basename(动作表._动作表路径)
      路径组.push(动作表._动作表路径)
      submenu.push(
        {
          icon: "iconConfig",
          label: 文件名,
          submenu: [
            {
              element: (() => {
                let div = document.createElement('div')
                //div._动作表路径 = 动作表._动作表路径
                div.setAttribute('data-list-path', 动作表._动作表路径)
                divs.push(div)
                return div
              })()
            }
          ],
        }
      )
    }
  )
  console.log(submenu)
  menu.addItem({
    icon: "iconSparkles",
    label: label,
    submenu: submenu,
  });
  setTimeout(async () => {
    let 动作表数组 = await 根据上下文获取动作表(context, blocks);

    let 分组动作表 = 动作表数组.reduce((groups, 动作) => {
      let key = 动作._动作表路径;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(动作);
      return groups;
    }, {});

    // 为每个分组创建一个菜单组
    for (let key of 路径组) {
      try {
        let 动作组 = 分组动作表[key]
        动作组 = 动作组 && 动作组.filter(item => { return item.blockAction });

        let div = divs.find(item => { return item.getAttribute('data-list-path') == key })
        if (动作组 && 动作组[0]) {
          let 动作菜单组 = 根据动作序列生成菜单组(动作组, context);
          div.parentElement.parentElement.appendChild(动作菜单组);
          div.parentElement.remove();
        }
        else {
          div.parentElement.parentElement.parentElement.parentElement.remove()
        }
      } catch (e) {
        console.warn(e)
      }
    }

  }, 0)
}