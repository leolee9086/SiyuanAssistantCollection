<template>
    <div class="fn__flex-column fn__flex-1">
        <div class="sac-breadcrumb "></div>

        <div class="fn__flex-1" style="padding:16px 16px 229.5px 24px;background-color: var(--b3-theme-background);">
            <h1><a :href="link.value">{{ title }}</a></h1>
            <div class="protyle-wysiwyg protyle-wysiwyg--attr cc-rss-content" v-html="content.value">
            </div>
        </div>
        <div>{{ link }}</div>

        <div>{{ content }}</div>
    </div>
</template>
<script setup>
import { ref, onMounted, inject } from 'vue';
import { sac } from 'runtime'
import { isAbsoluteURL } from '../../../../utils/network/url.js'
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
    if (isAbsoluteURL(link)) {
        link.value.value = Lute.EscapeHTMLStr(feed.link);
    } else {
        link.value.value = Lute.EscapeHTMLStr(path);
    }

});

</script>