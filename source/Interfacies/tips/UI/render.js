import { 智能防抖 } from "../../../utils/functionTools.js";
import { getTipsContainers } from "./containers.js";
let 待添加数组 = []
export const showTips = (tipsItems) => {
    buildTips(tipsItems)
}
function escapeHTML(str) {
    return Lute.EscapeHTMLStr(str);
}
export const buildTips = async (item) => {
    console.log(item)
    let tipsConainer = getTipsContainers()
    item.item.forEach(
        item => {
            if (item) {
                // 如果不存在，则添加新的元素
                let imageHTML = item.image ? `<image src='${escapeHTML(item.image)}'></image>` : '';
                let divHTML = `<div class="fn__flex-1 b3-card__info" 
            style="font-size:small !important;background-color:var(--b3-theme-background);padding:4px !important;border-bottom:1px dashed var(--b3-theme-primary-light)">
            <div class="b3-card__body protyle-wysiwyg protyle-wysiwyg--attr" style="font-size:small !important;padding:0">
                <div>
                     <input class=" fn__flex-center"  type="checkbox"></input>
                    <strong><a href="${escapeHTML(item.link)}">${item.title}</a></strong>${item.description}
                </div>
                <div class="tips-image-container ">
                    ${imageHTML}
                </div>
                </div>
                </div>
                `;
                待添加数组.push({ content: divHTML, time: Date.now(), textScore: item.textScore, vectorScore: item.vectorScore, id: item.id })
                // tipsConainer.querySelector("#SAC-TIPS").innerHTML += (divHTML)
            }
        }
    )
    智能防抖(批量渲染(tipsConainer))
}
async function 批量渲染(container) {
    // 使用 Set 来去重，性能更好
    待添加数组 = 待添加数组.reduce((unique, item) => {
        return unique.some(u => u.id === item.id) ? unique : [...unique, item];
    }, []); let frag = document.createDocumentFragment();
    // 如果元素数量超过限制，移除多余的元素
    待添加数组.sort((a, b) => {
        if (a.vectorScore !== b.vectorScore) {
            // vectorScore 不相等时，根据 vectorScore 排序
            return b.vectorScore - a.vectorScore;
        } else if (a.textScore !== b.textScore) {
            // vectorScore 相等时，根据 textScore 排序
            return b.textScore - a.textScore;
        } else if (a.time !== b.time) {
            // vectorScore 和 textScore 都相等时，根据时间排序
            return b.time - a.time;
        } else {
            // 所有属性都相等时，根据内容长度排序
            let Amatch = a.content.match(/<mark>(.*?)<\/mark>|<span>(.*?)<\/span>/g);
            let Bmatch = b.content.match(/<mark>(.*?)<\/mark>|<span>(.*?)<\/span>/g);
            let aText = Amatch ? Amatch.join('') : '';
            let bText = Bmatch ? Bmatch.join('') : "";
            return bText.length - aText.length;
        }
    });


    if (待添加数组.length > 100) {
        待添加数组 = 待添加数组.slice(待添加数组.length - 100);
    }

    // 将过滤后的元素添加到 DocumentFragment
    待添加数组.forEach(item => {
        let div = document.createElement('div');
        div.innerHTML = item.content;
        frag.appendChild(div.firstChild);
    });
    container.querySelectorAll(".b3-card__info").forEach(div => {
        let checkbox = div.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            frag.prepend(div); // 将元素移动到"SAC-TIPS_pinned"中
        }
    }
    )
    // 一次性更新 container 的内容
    container.querySelector('#SAC-TIPS').innerHTML = '';
    container.querySelector('#SAC-TIPS').appendChild(frag);
}
