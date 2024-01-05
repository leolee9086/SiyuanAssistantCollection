import { 智能防抖 } from "../../../utils/functionTools.js";
import { sac } from "../runtime.js";
let 待添加数组 = []
export const showTips = (tipsItems, element) => {
    console.log(element)
    buildTips(tipsItems, element)
}
function escapeHTML(str) {
    return Lute.EscapeHTMLStr(str);
}
export const buildTips = async (item, element) => {
    console.log(item)
    item.item && item.item.forEach(
        item => {
            if (!item.targetBlocks) {
                return
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
                <div>
                     <input class=" fn__flex-center"  type="checkbox"></input>
                    <strong><a href="${escapeHTML(item.link)}">${item.title}</a></strong>
                    <strong>${item.textScore || 0}</strong>
                    <strong>${item.vectorScore || 0}</strong>
                    <strong>${item.id}</strong>
                    <strong data-source="${item.source}">${item.source}</strong>
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
                    id: item.id,
                    targetBlocks: item.targetBlocks,
                    render: item.render
                })
                // tipsConainer.querySelector("#SAC-TIPS").innerHTML += (divHTML)
            }
        }
    )
    智能防抖(批量渲染(element))
}
const openFocusedTipsByEvent = (event) => {
    console.log(event.target.dataset.source)
    const source = event.target.dataset.source
    if (source) {
        sac.eventBus.emit('tips-ui-open-tab', {
            type: "focusedTips",
            title: source
        })
    }
}
async function 批量渲染(element) {
    element.removeEventListener('click', openFocusedTipsByEvent)
    element.addEventListener('click', openFocusedTipsByEvent)
    if (!element) {
        return
    }
    待添加数组 = 待添加数组.reduce((unique, item) => {
        return unique.some(u => u.id === item.id) ? unique : [...unique, item];
    }, []);
    let frag = document.createDocumentFragment();
    // 如果元素数量超过限制，移除多余的元素
    待添加数组.sort((a, b) => {
        // 计算时间差，单位为秒
        let timeDiff = Math.abs(a.time - b.time) / 1000;
        if (timeDiff > 1) {
            // 如果时间差大于1秒，按照时间排序
            return b.time - a.time;
        } else {
            // 如果时间差小于或等于1秒，按照 vectorScore 排序
            if (a.vectorScore !== b.vectorScore) {
                return b.vectorScore - a.vectorScore;
            } else if (a.textScore !== b.textScore) {
                // 如果 vectorScore 相等，按照 textScore 排序
                return b.textScore - a.textScore;
            } else {
                // 如果 vectorScore 和 textScore 都相等，按照 content 中 <mark> 或 <span> 标签内的文本长度排序
                let Amatch = a.content.match(/<mark>(.*?)<\/mark>|<span>(.*?)<\/span>/g);
                let Bmatch = b.content.match(/<mark>(.*?)<\/mark>|<span>(.*?)<\/span>/g);
                let aText = Amatch ? Amatch.join('') : '';
                let bText = Bmatch ? Bmatch.join('') : "";
                return bText.length - aText.length;
            }
        }
    });
    if (待添加数组.length > 20) {
        // 反向数组，使最新的元素在前
        // 待添加数组.reverse();
        // 修剪数组，只保留最新的20个元素
        待添加数组 = 待添加数组.slice(0, 20);
        // 再次反向数组，使元素回到原来的顺序
        // 待添加数组.reverse();
    }
    console.log(待添加数组)
    // 将过滤后的元素添加到 DocumentFragment
    待添加数组.forEach(item => {
        let div = document.createElement('div');
        div.innerHTML = item.content;
        frag.appendChild(div.firstChild);
    });
    element.querySelectorAll(".b3-card__info").forEach(div => {
        let checkbox = div.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            frag.prepend(div); // 将元素移动到"SAC-TIPS_pinned"中
        }
    }
    )
    // 一次性更新 container 的内容
    element.querySelector('#SAC-TIPS').innerHTML = '';
    element.querySelector('#SAC-TIPS').appendChild(frag);
}

