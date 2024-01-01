<template>
        <div class="fn__flex sac-rss-card">

    <svg class="svg ft__on-surface fn__flex-center">
        <use xlink:href="#iconSort"></use>
    </svg>
    <select class="b3-select">
        <option selected="" value="0">更新时间降序</option>
        <option value="1">更新时间升序</option>
        <option value="2">下载次数降序</option>
        <option value="3">下载次数升序</option>
    </select>
    <div class="fn__space"></div>
    <div class="b3-form__icon">
        <svg class="b3-form__icon-icon">
            <use xlink:href="#iconSearch"></use>
        </svg>
        <input class="b3-text-field b3-form__icon-input" placeholder="Enter 搜索">
    </div>

    <div class="fn__space"></div>
    <div class="counter fn__flex-center b3-tooltips b3-tooltips__w" aria-label="总计"
        style="background: var(--b3-theme-surface)">34</div>
    <div class="fn__space"></div>
    <div class="b3-form__icon fn__flex-1 fn__flex">
        <svg class="b3-form__icon-icon">
            <use xlink:href="#iconLock"></use>
        </svg>
        <input class="b3-text-field b3-form__icon-input fn__flex-1"  
        placeholder="当前包类型要求鉴权,请在此处黏贴你获得的apiToken"
        type="password"
        >
    </div>
    <div class="fn__space"></div>
    </div>
</template>
<script setup>
</script>