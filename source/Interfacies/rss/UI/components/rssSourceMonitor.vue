<template>
    <div class="fn__flex-1 fn__flex b3-card b3-card--wrap sac-rss-card">
        <div class="b3-card__body fn__flex" style="font-size:small !important;padding:0">
            <div class="b3-card__actions b3-card__actions--right">
                <span class="block__icon block__icon--show ariaLabel" data-rss-adapter-source="github"
                    aria-label="安装解析器"
                    @click="openGithubSourceTab"
                    >
                    <svg>
                        <use xlink:href="#iconAdd"></use>
                    </svg>
                </span>
                <span class="block__icon block__icon--show ariaLabel" aria-label="查看所有" data-rss-adapter-source="siyuan">
                    <svg>
                        <use xlink:href="#iconList"></use>
                    </svg>
                </span>
            </div>
        </div>
    </div>
    <template v-for="item in list">
        <rssSourceCard :itemName="item"></rssSourceCard>
    </template>
</template>
<script setup>
import { sac } from 'runtime';
import { onMounted,ref } from 'vue';
import rssSourceCard from './rssSources/rssSourceCard.vue';
let list = ref([])
onMounted(()=>{
    sac.路由管理器.internalFetch('/search/rss/list', {
        body: {
            page: 1
        }, method: 'POST'
    }).then(res=>{
        list.value =res.body.data
    })
})
const openGithubSourceTab= ()=>{
    sac.eventBus.emit(
        'rss-ui-open-tab',
        {
            icon:"iconGithub",
            title:"添加rss适配器",
            type:"rssAdaptersGithub"
        }
    )
}
</script>