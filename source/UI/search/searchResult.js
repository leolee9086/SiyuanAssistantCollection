import { string2DOM } from "../builders/index.js";
import { clientApi,plugin } from "../../asyncModules.js";
export let searchResult = string2DOM(
    `  <div class="search__layout">
<div id="searchList" class="fn__flex-1 search__list b3-list b3-list--background">
<div data-type="search-item" class="b3-list-item b3-list-item--focus" data-node-id="20231008190851-50oo19h" data-root-id="20231008183626-fjbvsbs">
        <svg class="b3-list-item__graphic"><use xlink:href="#iconParagraph"></use></svg>
        <span class="b3-list-item__text">Positive prompt words are used to inform the model of the desired features, style elements, and visual characteristics of the image. Detailed prompt words can help generate better images.@score:0.7284316953640915</span>
        <span class="b3-list-item__meta b3-list-item__meta--ellipsis ariaLabel" aria-label="电子书和资料/人力资本理论">电子书和资料/人力资本理论</span>
</div>
</div>
<div class="search__drag"></div>
<div id="searchPreview" class="fn__flex-1 search__preview protyle" data-loading="finished">
</div>`
)
searchResult.addEventListener(
    'resultID-setted',(e)=>{
        let {id}= e.detail
         new clientApi.Protyle(plugin.app, searchResult.querySelector("#searchPreview") , {
        blockId: id,//"20231011203156-3htnon3",
        render: {
            gutter: true,
            breadcrumbDocName: true
        },
    });
    }
)