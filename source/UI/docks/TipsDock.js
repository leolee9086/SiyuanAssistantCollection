import { plugin } from "../../asyncModules.js";
import { 智能防抖 } from "../../utils/functionTools.js";
//import { initVueApp } from "../componentsLoader.js";
import logger from '../../logger/index.js'
let container
let pinnedContainer
let element
async function 批量渲染(动作表, 执行上下文, container) {
    let frag = document.createDocumentFragment();
    let childrenHTML = Array.from(container.children).map(child => child.innerHTML);
    for (let 动作 of 动作表) {
        try {
            if (动作.tipRender instanceof Function) {
                /*let divHTML = `
                <div class="fn__flex-1 fn__flex-column" >
                    <div class="b3-card__info b3-card__info--left fn__flex-1">
                        ${动作.label} <span class="ft__on-surface ft__smaller">${动作.describe || ""}</span>
                        <div class="b3-card__body">

                        </div>
                    </div>
                    <div>Tips for block: <a href="siyuan://blocks/${执行上下文.blocks[0].id}">${执行上下文.blocks[0].id}</div>
                </div>
            `;*/
                let divHTML = ""
                const div = document.createElement('div');
                div.setAttribute('class', 'tips-card');
                div.innerHTML = divHTML;
                let { title, link, description, item } = await 动作.tipRender(执行上下文);
                console.log(title, link, description)
                item.forEach(
                    item => {
                        const div = document.createElement('div');
                        div.innerHTML = `<div class="fn__flex-1 b3-card__info" 
                        style="font-size:smaller;background-color:var(--b3-theme-background);padding:4px !important;border-bottom:1px dashed var(--b3-theme-primary-light)">
                        <div class="b3-card__body">
                            <div>
                                 <input class=" fn__flex-center"  type="checkbox"></input>
                                <strong><a href="${item.link}">${item.title}</a></strong>${item.description}
                            </div>
                            <div class="tips-image-container">
                            </div>
                            </div>
                            </div>`
                        if (item.image) {
                            div.querySelector('.tips-image-container').innerHTML = `<image src='${item.image}'></image>`
                        }
                        frag.prepend(div);
                    }
                )
                //div.setAttribute('markdown-content', markdown)
            }
        } catch (e) {
            logger.tipswarn(e)
        }
    }
    container.prepend(frag);
    setTimeout(() => {
        if (container.children[0] && container.children[0].children[0]) {
            container.children[0].children[0].scrollIntoView();
        }
    }, 0)
}
// 批量移除函数
async function 批量移除(container) {
    if (container.children.length > 50) {
        let children = Array.from(container.children);
        let elementsToRemove = children.slice(0, children.length - 50).filter(element => { return !element.classList.contains('pinned') });
        elementsToRemove.forEach(element => container.removeChild(element));
    }
}
// 使用智能防抖函数封装
const 渲染tips = 智能防抖(async (动作表, 执行上下文) => {
    await 智能防抖(批量渲染)(动作表, 执行上下文, container);
    智能防抖(批量移除)(container);
})
//不行,性能防抖不好做进去,性能跟不上,卡得惨绝人寰,这里就不用vue了
//let tipsApp = initVueApp(import.meta.resolve('./tipsDock.vue'), 'tipsDock', {}, plugin.localPath)
plugin.eventBus.on('hint_tips', async (e) => {
    let _element = await plugin.statusMonitor.get('tipsConainer', 'main').$value;
    if (_element && _element !== element) {
        element = _element
        // tipsApp.mount(_element)
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

