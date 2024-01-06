import { hasClosestByAttribute } from "../../../utils/DOMFinder.js";
import { 智能防抖 } from "../../../utils/functionTools.js";
import { sac } from "../runtime.js";
import { 排序待添加数组 } from "../utils/tipsArrayUtils.js";
let 待添加数组 = globalThis[Symbol.for('sac-tips')]||[]
globalThis[Symbol.for('sac-tips')]=待添加数组
export const showTips = (tipsItems, element,context) => {
    console.log(element)
    buildTips(tipsItems, element,context)
}
function escapeHTML(str) {
    return Lute.EscapeHTMLStr(str);
}
export const buildTips = async (item, element,context) => {
    console.log(item)
    item.item && item.item.forEach(
        item => {
            if (!item.targetBlocks) {
                return
            }
            if(!item.actionId){
                item.actionId=Lute.NewNodeID()
            }
            if(item.action){
                item.$action=()=>{
                    item.action(context)
                }
            }
            
            if (item) {
                // 如果不存在，则添加新的元素
                let imageHTML = item.image ? `<image src='${escapeHTML(item.image)}'></image>` : '';
                let divHTML = `<div class="fn__flex-1 b3-card__info" 
            style="
            font-size:small !important;
            background-color:var(--b3-theme-background);
            padding:4px !important;
            max-height:16.66vh;
            overflow-y:hidden;
            border-bottom:1px dashed var(--b3-theme-primary-light)">
            <div class="b3-card__body protyle-wysiwyg protyle-wysiwyg--attr" style="font-size:small !important;padding:0">
                <div class="fn__flex fn__flex-column">
                    <div class="fn__flex fn__flex-1">
                    <span class="sac-icon-actions" data-action-id="${item.actionId}" style="${item.$action?"color: var(--b3-theme-primary);":"color: transparent;"}">
                    <svg class="b3-list-item__graphic"><use xlink:href="#iconSparkles"></use></svg>
                    </span>
                    <strong><a href="${escapeHTML(item.link)}">${item.title}</a></strong>
                    <strong>${item.textScore || 0}</strong>
                    <strong>${item.vectorScore || 0}</strong>
                    <strong>${item.id}</strong>
                    <strong data-source="${item.source}">${item.source}</strong>
                    <div class="fn__space fn__flex-1"></div>
                    <input class=" fn__flex-center"  type="checkbox"></input>
                    </div>

                    <div>
                    ${item.description}
                    </div>
                 
                </div>
                <div class="tips-image-container ">
                    ${imageHTML}
                </div>
                </div>
                </div>
                `;
                待添加数组.push({
                    content: divHTML,
                    time: Date.now(),
                    textScore: item.textScore || 0,
                    vectorScore: item.vectorScore || 0,
                    ...item
                })
                // tipsConainer.querySelector("#SAC-TIPS").innerHTML += (divHTML)
            }
        }
    )
    智能防抖(批量渲染(element))
}
const openFocusedTipsByEvent = (event) => {
    const source = event.target.dataset.source
    if (source) {
        sac.eventBus.emit('tips-ui-open-tab', {
            type: "focusedTips",
            title:source,
            source:source
        })
    }
    let actionIcon=hasClosestByAttribute(event.target,'data-action-id')
    if(actionIcon){
        let actionItem= 待添加数组.find(item=>{
            return item.actionId===actionIcon.getAttribute('data-action-id')
        })
        actionItem&&actionItem.$action()
    }
}
// 移除和添加事件监听器
function 更新事件监听(element) {
    element.removeEventListener('click', openFocusedTipsByEvent);
    element.addEventListener('click', openFocusedTipsByEvent);
}

// 去重待添加数组中的元素
function 去重待添加数组() {
    待添加数组 = 待添加数组.reduce((unique, item) => {
        return unique.some(u => u.id === item.id) ? unique : [...unique, item];
    }, []);
}



// 限制待添加数组的长度
function 限制待添加数组长度() {
    if (待添加数组.length > 100) {
        待添加数组 = 待添加数组.slice(0, 100);
    }
}

// 创建 DocumentFragment 并添加待添加数组中的元素
function 创建并添加元素到DocumentFragment(frag) {
    待添加数组.forEach(item => {
        let div = document.createElement('div');
        div.innerHTML = item.content;
        frag.appendChild(div.firstChild);
    });
}

// 将选中的元素移动到 DocumentFragment 的顶部
function 移动选中元素到顶部(element, frag) {
    element.querySelectorAll(".b3-card__info").forEach(div => {
        let checkbox = div.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            frag.prepend(div);
        }
    });
}

// 更新元素内容
function 更新元素内容(element, frag) {
    element.querySelector('#SAC-TIPS').innerHTML = '';
    element.querySelector('#SAC-TIPS').appendChild(frag);
}

// 批量渲染函数，使用上述拆分的函数
async function 批量渲染(element) {
    if (!element) {
        return;
    }
    更新事件监听(element);
    去重待添加数组();
    排序待添加数组(待添加数组);
    限制待添加数组长度();
    let frag = document.createDocumentFragment();
    创建并添加元素到DocumentFragment(frag);
    移动选中元素到顶部(element, frag);
    更新元素内容(element, frag);
}
