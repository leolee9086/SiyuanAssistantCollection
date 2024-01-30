import { emitEvent, string2DOM } from "../builders/index.js"
import { searchHeader } from "./searchHeader.js"
import { searchResult } from "./searchResult.js"
import { 以文本查找最相近文档 } from "../../searchers/index.js"
import { kernelApi } from "../../asyncModules.js"
export const panelHTML = `
<div class="fn__flex-column" style="height: 100%;border-radius: var(--b3-border-radius-b);overflow: hidden;">
</div>
`
export let panelElement = string2DOM(panelHTML)
export let replaceController = string2DOM(
    `    
    <div class="b3-form__icon search__header fn__none">
        <span class="fn__a" id="replaceHistoryBtn">
            <svg data-menu="true" class="b3-form__icon-icon"><use xlink:href="#iconReplace"></use></svg>
            <svg class="search__arrowdown"><use xlink:href="#iconDown"></use></svg>
        </span>
        <input id="replaceInput" class="b3-text-field b3-text-field--text">
        <svg class="fn__rotate fn__none svg" style="padding: 0 8px;align-self: center;"><use xlink:href="#iconRefresh"></use></svg>
        <button id="replaceAllBtn" class="b3-button b3-button--small b3-button--outline fn__flex-center">全部替换</button>
        <div class="fn__space"></div>
        <button id="replaceBtn" class="b3-button b3-button--small b3-button--outline fn__flex-center">↵ 替换</button>
        <div class="fn__space"></div>
        <div id="replaceHistoryList" data-close="false" class="fn__none b3-menu b3-list b3-list--background"></div>
    </div>
    `
)
export let searchHistoryController = string2DOM(
    `<div id="criteria" class="fn__flex" style="min-height:40px;background-color: var(--b3-theme-background)">
<div class="b3-chips">
</div>
<span class="fn__flex-1"></span>
<button data-type="saveCriterion" class="b3-button b3-button--small b3-button--outline fn__flex-center">保存查询条件</button>
<span class="fn__space"></span>
<button data-type="removeCriterion" aria-label="清空后可使用上一次的查询条件" class="b3-tooltips b3-tooltips__nw b3-button b3-button--small b3-button--outline fn__flex-center">清空查询条件</button>
<span class="fn__space"></span>
</div>`
)

export let blockIcons = string2DOM(
    `
    <div class="block__icons">
        <span data-type="previous" class="block__icon block__icon--show b3-tooltips b3-tooltips__ne" disabled="true" aria-label="上一页"><svg><use xlink:href="#iconLeft"></use></svg></span>
        <span class="fn__space"></span>
        <span data-type="next" class="block__icon block__icon--show b3-tooltips b3-tooltips__ne" disabled="true" aria-label="下一页"><svg><use xlink:href="#iconRight"></use></svg></span>
        <span class="fn__space"></span>
        <span id="searchResult" class="fn__flex-shrink ft__selectnone"></span>
        <span class="fn__space"></span>
        <span class="fn__flex-1"></span>
        <span id="searchPathInput" class="search__path ft__on-surface fn__flex-center ft__smaller fn__ellipsis ariaLabel" aria-label="">
            
            <svg class="search__rmpath fn__none"><use xlink:href="#iconCloseRound"></use></svg>
        </span>
        <span class="fn__space"></span>
        <button disabled="" id="searchInclude" class="b3-button b3-button--mid">包含子文档</button>
        <span class="fn__space"></span>
        <span id="searchPath" aria-label="指定路径" class="block__icon block__icon--show b3-tooltips b3-tooltips__w">
            <svg><use xlink:href="#iconFolder"></use></svg>
        </span>
        <div class="fn__flex fn__none">
            <span class="fn__space"></span>
            <span id="searchExpand" class="block__icon block__icon--show b3-tooltips b3-tooltips__w" aria-label="展开">
                <svg><use xlink:href="#iconExpand"></use></svg>
            </span>
            <span class="fn__space"></span>
            <span id="searchCollapse" class="block__icon block__icon--show b3-tooltips b3-tooltips__w" aria-label="折叠">
                <svg><use xlink:href="#iconContract"></use></svg>
            </span>
        </div>
    </div>
    
    `
)
export let tips = string2DOM(`  <div class="search__tip">
<kbd>↑/↓/PageUp/PageDown</kbd> 导航
<kbd>Ctrl+N</kbd> 新建
<kbd>Enter/Double Click</kbd> 打开
<kbd>Click</kbd> 切换到下一个命中
<kbd>Alt+./Alt+Click</kbd> 右侧分屏打开
<kbd>Esc</kbd> 退出搜索
</div>`)

searchHeader.addEventListener('query-change',async(e)=>{
    let data =await 以文本查找最相近文档(e.detail.value, 10, '', false, null, )
    console.log(data)
    if(data[0]){
        emitEvent(searchResult,'resultID-setted',{id:data[0].id})
        emitEvent(searchResult,'result-added',{data:data})
    }
})
panelElement.appendChild(searchHeader)
panelElement.appendChild(searchHistoryController)
panelElement.appendChild(blockIcons)
panelElement.appendChild(searchResult)
panelElement.appendChild(tips)
