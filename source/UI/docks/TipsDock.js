import { plugin } from "../../asyncModules.js";
import { 智能防抖 } from "../../utils/functionTools.js";
let container
let pinnedContainer
let element
async function 批量渲染(动作表, 执行上下文, container) {
    let frag = document.createDocumentFragment();
    for (let 动作 of 动作表) {
        if (动作.tipRender instanceof Function) {
            const div = document.createElement('div');
            div.setAttribute('class', 'tips-card');
            div.innerHTML = `
                <div class="fn__flex-1 fn__flex-column">
                    <div class="b3-card__info b3-card__info--left fn__flex-1">
                        ${动作.label} <span class="ft__on-surface ft__smaller">${动作.describe || ""}</span>
                        <div class="b3-card__body">

                        </div>
                    </div>
                    <div>Tips for block: <a href="siyuan://blocks/${执行上下文.blocks[0].id}">${执行上下文.blocks[0].id}</div>
                </div>
            `;
            let {element,markdown} = await 动作.tipRender(执行上下文);
            if(!markdown){
                console.warn('至少需要提供markdown,没有markdown内容的tips不会给AI参考')
            }else(
                div.setAttribute('markdown-content',markdown)
            )
            if (element instanceof HTMLElement && !(element.tagName === 'SCRIPT')) {
                div.querySelector(".b3-card__body").appendChild(element);
            }
            
            let isDuplicate = Array.from(container.children).some(child => child.innerHTML === div.innerHTML);
            if (!isDuplicate) {
                frag.prepend(div);
            }
        }
    }
    container.prepend(frag);
    container.scrollTop=0
}
// 批量移除函数
async function 批量移除(container) {
    if (container.children.length > 50) {
        let children = Array.from(container.children);
        let elementsToRemove = children.slice(0, children.length - 50).filter(element => !element.classList.contains('pinned'));
        elementsToRemove.forEach(element => container.removeChild(element));
    }
}
// 使用智能防抖函数封装
const 渲染tips = 智能防抖(async (动作表, 执行上下文) => {
    await 智能防抖(批量渲染)(动作表, 执行上下文, container);
    智能防抖(批量移除)(container);
})
plugin.eventBus.on('hint_tips', async(e) => {
    console.log(e.detail)
    let _element = await plugin.statusMonitor.get('tipsConainer', 'main');
    if(_element&&_element!==element){
        element=_element
         container = element.querySelector('#SAC-TIPS')
         pinnedContainer= element.querySelector('#SAC-TIPS_pinned')
         element.addEventListener('click', (event) => {
            const target = event.target.closest('.tips-card');
            if (target) {
                if (target.classList.contains('pinned')) {
                    target.classList.remove('pinned');
                    container.prepend(target);
                } else {
                    target.classList.add('pinned');
                    pinnedContainer.appendChild(target);
                }
            }
        });
        element.addEventListener('dblclick', (event) => {
            const target = event.target.closest('.tips-card');
            if (target) {
                if (target.classList.contains('selected')) {
                    target.classList.remove('selected');
                } else {
                    target.classList.add('selected');
                }
            }
        });
        
    }
    渲染tips(e.detail.备选动作表, e.detail.context)
})

