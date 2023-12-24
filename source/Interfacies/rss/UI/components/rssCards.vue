<template>
    <template v-for="repo in data">
        <div class="fn__flex-1 fn__flex b3-card b3-card--wrap sac-rss-card" data-repo-name='' style="max-height:100px">
            <div class="b3-card__body fn__flex" style="font-size:small !important;padding:0">
                <div class="b3-card__img">
                    <img style="width:74px;height:74px" :src="repo.iconUrl" />
                </div>
                <div class="fn__flex-1 fn__flex-column">
                    <div class="b3-card__info b3-card__info--left fn__flex-1">
                        <span class="ft__on-surface ft__smaller">{{ repo.name }}</span>
                        <div class="b3-card__desc" title="${repo.name}">
                            {{ repo.name }}
                        </div>
                    </div>
                </div>
                <div class="b3-card__actions b3-card__actions--right">
                    <span class="block__icon block__icon--show ariaLabel" aria-label="安装" data-rss-name='${repo.name}'
                        data-repo-name='${repo.repoUrl}' data-repo-source="github">
                        <svg>
                            <use xlink:href="#iconDownload"></use>
                        </svg>
                    </span>
                    <span class="block__icon block__icon--show ariaLabel" aria-label="更新" data-rss-name='${repo.name}'
                        data-repo-name='${repo.repoUrl}' data-repo-source="github">
                        <svg>
                            <use xlink:href="#iconRefresh"></use>
                        </svg>
                    </span>
                    <span class="block__icon block__icon--show ariaLabel" aria-label="卸载" data-rss-name='${repo.name}'
                        data-repo-name='${repo.repoUrl}' data-repo-source="github">
                        <svg>
                            <use xlink:href="#iconTrashcan"></use>
                        </svg>
                    </span>
                    <span class="block__icon block__icon--show ariaLabel" data-rss-name='${repo.readme}' aria-label="查看详情">
                        <svg>
                            <use xlink:href="#iconList"></use>
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    </template>
</template>
<script setup>
import { sac } from 'runtime'
import { ref } from 'vue';
let data = ref([])
console.error(sac.statusMonitor.get('rss', 'sources', 'github').$value)
sac.eventBus.on('statusChange', (e) => {
    console.log(e)
    if (e.detail.name === 'rss.sources.github') {
        data.value = e.detail.value
    }
})

</script>