import { plugin } from "../../asyncModules.js";
import { 智能防抖 } from "../../utils/functionTools.js";
import logger from '../../logger/index.js'
let container
let pinnedContainer
let element
let controller = new AbortController();
let 待渲染数组 = []
let 待添加数组 = []
let signal = controller.signal
async function 批量渲染(动作表, 执行上下文, container, signal) {
    for (let 动作 of 动作表) {
        try {
            if (动作.tipRender instanceof Function) {
                待渲染数组.push([动作.tipRender, 执行上下文])
                //div.setAttribute('markdown-content', markdown)
            }
        } catch (e) {
            logger.tipswarn(e)
        }
    }
    let 渲染计数 = 0;
    logger.tipslog(待渲染数组)
    for (let 渲染数据对 of 待渲染数组) {
        //也就是第一个结果必然会被加入
        if (signal && signal.aborted) {
            break;
        }
        let [渲染函数, 执行上下文] = 渲染数据对
        try {
            let results = await 渲染函数(执行上下文);
            if (!results) {
                渲染计数++;
                continue
            }
            let { title, link, description, item } = results
            item.forEach(
                item => {
                    if (item) {
                        // 如果不存在，则添加新的元素
                        let imageHTML = item.image ? `<image src='${item.image}'></image>` : '';
                        let divHTML = `<div class="fn__flex-1 b3-card__info" 
                    style="font-size:smaller;background-color:var(--b3-theme-background);padding:4px !important;border-bottom:1px dashed var(--b3-theme-primary-light)">
                    <div class="b3-card__body">
                        <div>
                             <input class=" fn__flex-center"  type="checkbox"></input>
                            <strong><a href="${item.link}">${item.title}</a></strong>${item.description}
                        </div>
                        <div class="tips-image-container">
                            ${imageHTML}
                        </div>
                        </div>
                        </div>
                      
                        `;
                        待添加数组.push(divHTML)
                    }
                }
            )
        } catch (e) {
            logger.tipsError(e)
        }
        渲染计数++;
    }
    待渲染数组.splice(0, 渲染计数);
    // 一次性移除已经被渲染的项目
    setTimeout(() => {
        if (container.children[0] && container.children[0].children[0]) {
            container.children[0].children[0].scrollIntoView();
        }
    }, 0)
}
// 批量移除函数
function 批量移除(container) {
    // 使用 Set 来去重，性能更好
    let uniqueItems = new Set(待添加数组);
    待添加数组 = Array.from(uniqueItems);
    let frag = document.createDocumentFragment();
    // 如果元素数量超过限制，移除多余的元素
    待添加数组.reverse();

    if (待添加数组.length > 50) {
        待添加数组 = 待添加数组.slice(待添加数组.length - 50);
    }

    // 将过滤后的元素添加到 DocumentFragment
    待添加数组.forEach(item => {
        let div = document.createElement('div');
        div.innerHTML = item;
        frag.appendChild(div.firstChild);
    });
    待添加数组.reverse();

    // 一次性更新 container 的内容
    container.innerHTML = '';
    container.appendChild(frag);
}
// 使用智能防抖函数封装
const 渲染tips = async (动作表, 执行上下文) => {
    controller.abort()
    controller = new AbortController();
    signal = controller.signal
    批量渲染(动作表, 执行上下文, container, signal);
    智能防抖(批量移除)(container, signal);
}
//不行,性能防抖不好做进去,性能跟不上,卡得惨绝人寰,这里就不用vue了
plugin.eventBus.on('hint_tips', async (e) => {
    let _element = await plugin.statusMonitor.get('tipsConainer', 'main').$value;
    if (_element && _element !== element) {
        element = _element
        container = element.querySelector('#SAC-TIPS')
        pinnedContainer = element.querySelector('#SAC-TIPS_pinned')
        element.addEventListener('click', (event) => {
            const target = event.target.closest('.tips-card');
            if (target) {
                if (target.classList.contains('pinned')) {
                    target.classList.remove('pinned');
                    target.classList.remove('selected');

                    container.prepend(target);
                } else {
                    target.classList.add('pinned');
                    target.classList.add('selected');
                    pinnedContainer.appendChild(target);
                }
            }
        });
    }
    if (container && pinnedContainer) {
      渲染tips(e.detail.备选动作表, e.detail.context)
    } else {
        logger.tipswarn('渲染tips出错,容器可能不存在:', container, pinnedContainer)
    }
})

