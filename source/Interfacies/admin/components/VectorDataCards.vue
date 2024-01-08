<template>
    <div class="b3-form__icon search__header">
        <span class="fn__a" id="searchHistoryBtn">
            <svg data-menu="true" class="b3-form__icon-icon">
                <use xlink:href="#iconSearch"></use>
            </svg>
            <svg class="search__arrowdown">
                <use xlink:href="#iconDown"></use>
            </svg>
        </span>
        <input id="searchInput" style="padding-right: 60px" class="b3-text-field b3-text-field--text"
            placeholder="输入文字将进行矢量搜索" @change="(e) => { searchBlocks(e.target.value) }"
            @input="(e) => { searchBlocks(e.target.value) }">
        <div id="searchHistoryList" data-close="false" class="fn__none b3-menu b3-list b3-list--background"></div>
    </div>
    <div class="block__icons">
        <span id="searchRefresh" aria-label="刷新" class="block__icon b3-tooltips b3-tooltips__w">
            <svg>
                <use xlink:href="#iconRefresh"></use>
            </svg>
        </span>
        <span class="fn__space"></span>
        <span id="searchReplace" aria-label="替换" class="block__icon b3-tooltips b3-tooltips__w">
            <svg>
                <use xlink:href="#iconReplace"></use>
            </svg>
        </span>
        <span class="fn__space"></span>
        <span id="searchSyntaxCheck" aria-label="搜索方式 关键字" class="block__icon b3-tooltips b3-tooltips__w">
            <svg>
                <use xlink:href="#iconRegex"></use>
            </svg>
        </span>
        <span class="fn__space"></span>
        <span id="searchFilter" aria-label="类型" class="block__icon b3-tooltips b3-tooltips__w">
            <svg>
                <use xlink:href="#iconFilter"></use>
            </svg>
        </span>
        <span class="fn__space"></span>
        <span id="searchMore" aria-label="更多" class="block__icon b3-tooltips b3-tooltips__w">
            <svg>
                <use xlink:href="#iconMore"></use>
            </svg>
        </span>
        <span class="fn__space"></span>
        <span id="searchOpen" aria-label="在新页签中打开" class="block__icon b3-tooltips b3-tooltips__w">
            <svg>
                <use xlink:href="#iconLayoutRight"></use>
            </svg>
        </span>
        <span class="fn__space"></span>
        <span id="searchAsset" aria-label="搜索资源文件内容" class="block__icon b3-tooltips b3-tooltips__w">
            <svg>
                <use xlink:href="#iconExact"></use>
            </svg>
        </span>
    </div>

    <div class="b3-form__icon search__header fn__none">
        <span class="fn__a" id="replaceHistoryBtn">
            <svg data-menu="true" class="b3-form__icon-icon">
                <use xlink:href="#iconReplace"></use>
            </svg>
            <svg class="search__arrowdown">
                <use xlink:href="#iconDown"></use>
            </svg>
        </span>
        <input id="replaceInput" class="b3-text-field b3-text-field--text">
        <svg class="fn__rotate fn__none svg" style="padding: 0 8px;align-self: center;">
            <use xlink:href="#iconRefresh"></use>
        </svg>
        <button id="replaceAllBtn" class="b3-button b3-button--small b3-button--outline fn__flex-center">全部替换</button>
        <div class="fn__space"></div>
        <button id="replaceBtn" class="b3-button b3-button--small b3-button--outline fn__flex-center">↵ 替换</button>
        <div class="fn__space"></div>
        <div id="replaceHistoryList" data-close="false" class="fn__none b3-menu b3-list b3-list--background"></div>
    </div>
    <div id="criteria" class="fn__flex" style="min-height:40px;background-color: var(--b3-theme-background)">
        <div class="b3-chips">
        </div>
        <span class="fn__flex-1"></span>
        <button data-type="saveCriterion"
            class="b3-button b3-button--small b3-button--outline fn__flex-center">保存查询条件</button>
        <span class="fn__space"></span>
        <button data-type="removeCriterion" aria-label="清空后可使用上一次的查询条件"
            class="b3-tooltips b3-tooltips__nw b3-button b3-button--small b3-button--outline fn__flex-center">清空查询条件</button>
        <span class="fn__space"></span>
    </div>
    <div class="block__icons">
        <span data-type="previous" class="block__icon block__icon--show b3-tooltips b3-tooltips__ne" disabled="true"
            aria-label="上一页"><svg>
                <use xlink:href="#iconLeft"></use>
            </svg></span>
        <span class="fn__space"></span>
        <span data-type="next" class="block__icon block__icon--show b3-tooltips b3-tooltips__ne" disabled="true"
            aria-label="下一页"><svg>
                <use xlink:href="#iconRight"></use>
            </svg></span>
        <span class="fn__space"></span>
        <span id="searchResult" class="fn__flex-shrink ft__selectnone"></span>
        <span class="fn__space"></span>
        <span class="fn__flex-1"></span>
        <span id="searchPathInput" class="search__path ft__on-surface fn__flex-center ft__smaller fn__ellipsis ariaLabel"
            aria-label="">

            <svg class="search__rmpath fn__none">
                <use xlink:href="#iconCloseRound"></use>
            </svg>
        </span>
        <span class="fn__space"></span>
        <button disabled="" id="searchInclude" class="b3-button b3-button--mid">包含子文档</button>
        <span class="fn__space"></span>
        <span id="searchPath" aria-label="指定路径" class="block__icon block__icon--show b3-tooltips b3-tooltips__w">
            <svg>
                <use xlink:href="#iconFolder"></use>
            </svg>
        </span>
        <div class="fn__flex fn__none">
            <span class="fn__space"></span>
            <span id="searchExpand" class="block__icon block__icon--show b3-tooltips b3-tooltips__w" aria-label="展开">
                <svg>
                    <use xlink:href="#iconExpand"></use>
                </svg>
            </span>
            <span class="fn__space"></span>
            <span id="searchCollapse" class="block__icon block__icon--show b3-tooltips b3-tooltips__w" aria-label="折叠">
                <svg>
                    <use xlink:href="#iconContract"></use>
                </svg>
            </span>
        </div>
    </div>
    <div class="search__tip" v-if="results[0]">
        <kbd>↑/↓/PageUp/PageDown</kbd> 导航
        <kbd>Ctrl+N</kbd> 新建
        <kbd>Enter/Double Click</kbd> 打开
        <kbd>Click</kbd> 切换到下一个命中
        <kbd>Alt+./Alt+Click</kbd> 右侧分屏打开
        <kbd>Esc</kbd> 退出搜索
    </div>
    {{ results }}
</template>
<script setup>
import { sac } from 'runtime';
import { ref } from 'vue'
const results = ref([])
const searchBlocks = (query) => {
    sac.路由管理器.internalFetch('/search/blocks/vector', {
        body: {
            query: query,
        },
        method: 'POST',
    }).then(
        res => {

            let data = res.body
            console.log(data)

            res.body ? results.value = data : null
        }
    )
}
</script>