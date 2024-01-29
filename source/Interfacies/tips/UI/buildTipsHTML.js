import * as cheerio from "../../../../static/cheerio.js";
import { sac } from "../runtime.js";
function escapeHTML(str) {
    return Lute.EscapeHTMLStr(str);
}
function isBlockDOM(str){
    let $ = cheerio.load(str);
    let allHaveAttributes = true;

    $('*').each(function() {
        if (!$(this).attr('data-node-id') || !$(this).attr('data-type')) {
            allHaveAttributes = false;
            return false; // break the loop
        }
    });

    return allHaveAttributes;
}
//这里之后要用lute来处理
export const genTipsHTML = (item) => {
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
        <span class="sac-icon-actions" data-action-id="${item.actionId}" style="${item.$action ? "color: var(--b3-theme-primary);" : "color: transparent;"}">
        <svg class="b3-list-item__graphic"><use xlink:href="#iconSparkles"></use></svg>
        </span>
        <strong><a href="${escapeHTML(item.link)}">${item.title}</a></strong>
        <strong data-source="${item.source}">${item.source}</strong>
        <div class="fn__space fn__flex-1"></div>
        <input class=" fn__flex-center"  type="checkbox"></input>
        </div>

        <div>
        ${sac.lute&&isBlockDOM(item.description)?sac.lute.Html2BlockDOM(item.description):item.description}
        </div>
     
    </div>
    <div class="tips-image-container ">
        ${imageHTML}
    </div>
    </div>
    </div>
    `;
    return divHTML
}