<template>
    <div class="fn__flex-1" style="padding:16px 16px 229.5px 24px;background-color: var(--b3-theme-background);">
        <h1><a :href="link.value">{{ title }}</a></h1>
        <div class="protyle-wysiwyg protyle-wysiwyg--attr" v-html="content.value"></div>
    </div>
</template>
<script setup>
import { ref, onMounted, inject } from 'vue';
import { sac } from 'runtime'
const content = ref({ value: "" });
const link = ref({ value: "" });
const lute = Lute.New();
const { path, item, title } = inject('appData')
onMounted(async () => {
    const response = await sac.路由管理器.internalFetch('/search/rss/feedContent', {
        method: "POST",
        body: {
            path, item
        }
    });
    const feed = await response.body;
    content.value.value = lute.SpinBlockDOM(feed.description);
    link.value.value = Lute.EscapeHTMLStr(feed.link);
});

</script>