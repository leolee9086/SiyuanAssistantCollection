import { string2DOM, emitEvent } from "../builders/index.js"
export let searchHeader = string2DOM(
    `<div class="b3-form__icon search__header">
        <span class="fn__a" id="searchHistoryBtn">
            <svg data-menu="true" class="b3-form__icon-icon"><use xlink:href="#iconSearch"></use></svg>
            <svg class="search__arrowdown"><use xlink:href="#iconDown"></use></svg>
        </span>
        <input id="searchInput" style="padding-right: 60px" class="b3-text-field b3-text-field--text" placeholder="输入文字将进行矢量搜索">
        <div id="searchHistoryList" data-close="false" class="fn__none b3-menu b3-list b3-list--background"></div>
    </div>`
)
searchHeader.querySelector('#searchInput').addEventListener(
    'change', (e) => {
        emitEvent(searchHeader, 'query-change', { value: e.target.value })
    }
)
export let searchBlockIcons = string2DOM(
    `
    <div class="block__icons">
        <span id="searchRefresh" aria-label="刷新" class="block__icon b3-tooltips b3-tooltips__w">
            <svg><use xlink:href="#iconRefresh"></use></svg>
        </span>
        <span class="fn__space"></span>
        <span id="searchReplace" aria-label="替换" class="block__icon b3-tooltips b3-tooltips__w">
            <svg><use xlink:href="#iconReplace"></use></svg>
        </span>
        <span class="fn__space"></span>
        <span id="searchSyntaxCheck" aria-label="搜索方式 关键字" class="block__icon b3-tooltips b3-tooltips__w">
            <svg><use xlink:href="#iconRegex"></use></svg>
        </span>
        <span class="fn__space"></span>
        <span id="searchFilter" aria-label="类型" class="block__icon b3-tooltips b3-tooltips__w">
            <svg><use xlink:href="#iconFilter"></use></svg>
        </span>
        <span class="fn__space"></span>
        <span id="searchMore" aria-label="更多" class="block__icon b3-tooltips b3-tooltips__w">
            <svg><use xlink:href="#iconMore"></use></svg>
        </span>
        <span class="fn__space"></span>
        <span id="searchOpen" aria-label="在新页签中打开" class="block__icon b3-tooltips b3-tooltips__w">
            <svg><use xlink:href="#iconLayoutRight"></use></svg>
        </span>
        <span class="fn__space"></span>
        <span id="searchAsset" aria-label="搜索资源文件内容" class="block__icon b3-tooltips b3-tooltips__w">
            <svg><use xlink:href="#iconExact"></use></svg>
        </span>
    </div>
    `
)
searchHeader.appendChild(
    searchBlockIcons
)