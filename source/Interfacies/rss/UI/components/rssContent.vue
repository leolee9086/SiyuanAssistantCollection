<template>
    <div class="fn__flex-column fn__flex-1">
        <div class="sac-breadcrumb "></div>
        <div class="fn__flex-1" style="padding:16px 16px 229.5px 24px;background-color: var(--b3-theme-background);">
            <h1>
                <span data-type="sac-link" :href="link.value" @click="openlink">{{ title }}</span>
            </h1>
            <div class="protyle-wysiwyg protyle-wysiwyg--attr cc-rss-content" v-html="content.value">
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, inject } from 'vue';
import { sac } from 'runtime'
const content = ref({ value: "" });
const link = ref({ value: "" });
const lute = Lute.New();
const { path, item, title, endpoint } = inject('appData')
onMounted(async () => {
    const response = await sac.路由管理器.internalFetch('/search/rss/feedContent', {
        method: "POST",
        body: {
            path, item, type: "syhtml"
        }
    });
    const feed = await response.body;
    content.value.value = lute.SpinBlockDOM(feed.description);
    link.value.value = Lute.EscapeHTMLStr(feed.link);

});
const openlink=(e)=>{
    let href = e.currentTarget.getAttribute('href')
    window.open(href)
}
</script>
<style>
span[data-type="sac-link"]{
    color:var(--b3-theme-primary)
}
</style>