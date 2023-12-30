<template>
    <div class="fn__flex-1 fn__flex-column b3-cards">
        <rssAdapterAddCard></rssAdapterAddCard>
        <template v-for="repo in data">
            <div class="fn__flex-1 fn__flex b3-card b3-card--wrap sac-rss-card" data-repo-name=''>
                <div class="b3-card__body fn__flex" style="font-size:small !important;padding:0">
                    <div class="b3-card__img">
                        <img v-if="repo.iconUrl" style="width:74px;height:74px" :src="repo.iconUrl" />
                        <svg v-if="!repo.iconUrl" style="width:74px;height:74px">
                    <use xlink:href="#iconRSS"></use>
                </svg>
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
                        <span v-if="!installed[repo.name]" class="block__icon block__icon--show ariaLabel" aria-label="安装"
                            :data-rss-name='repo.name' data-repo-name='${repo.repoUrl}' data-repo-source="github"
                            @click="() => { install(repo) }">
                            <svg>
                                <use xlink:href="#iconDownload"></use>
                            </svg>
                        </span>
                        <span v-if="!updated[repo.name]" class="block__icon block__icon--show ariaLabel" aria-label="更新"
                            data-rss-name='${repo.name}' data-repo-name='${repo.repoUrl}' data-repo-source="github">
                            <svg>
                                <use xlink:href="#iconRefresh"></use>
                            </svg>
                        </span>
                        <span v-if="installed[repo.name]" class="block__icon block__icon--show ariaLabel" aria-label="卸载"
                            data-rss-name='${repo.name}' data-repo-name='${repo.repoUrl}' data-repo-source="github"
                            @click="() => { uninstall(repo) }">
                            <svg>
                                <use xlink:href="#iconTrashcan"></use>
                            </svg>
                        </span>
                        <span v-if="repo.source === 'github'" class="block__icon block__icon--show ariaLabel"
                            data-rss-name='${repo.readme}' aria-label="查看详情" @click="() => { openPackagePage(repo) }">
                            <svg>
                                <use xlink:href="#iconGithub"></use>
                            </svg>
                        </span>
                        <span v-if="repo.source === 'npm'" class="block__icon block__icon--show ariaLabel"
                            data-rss-name='${repo.readme}' aria-label="查看详情" @click="() => { openPackagePage(repo) }">
                            <svg>
                                <use xlink:href="#iconNPM"></use>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<script setup>
import { sac } from 'runtime'
import { ref, onMounted, reactive } from 'vue';
import rssAdapterAddCard from './rssAdapterAddCard.vue'
let data = ref([])
let installed = reactive({})
let updated = reactive({})
onMounted(() => {
    sac.路由管理器.internalFetch('/search/rss/listAdapters/all', {
        body: {
            page: 1
        }, method: 'POST'
    }).then(res => {
        data.value = res.body
        res.body.forEach(
            repo => {
                判定需要更新(repo)
                判定尚未安装(repo)
            }
        )
    })
})
const install = (repo) => {
    sac.路由管理器.internalFetch('/search/rss/install', {
        body: {
            packageSource: repo.source,
            packageRepo: repo.repoUrl,
            packageName: repo.name
        }, method: 'POST'
    }).then(res => {
        setTimeout(() => 判定尚未安装(repo), 500)
    })
}
const uninstall = (repo) => {
    sac.路由管理器.internalFetch('/search/rss/unInstall', {
        body: {
            packageSource: repo.source,
            packageRepo: repo.repoUrl,
            packageName: repo.name
        }, method: 'POST'
    }).then(res => {
        setTimeout(() => 判定尚未安装(repo), 500)
    })
}
const 判定尚未安装 = (repo) => {
    sac.路由管理器.internalFetch('/search/rss/checkInstall', {
        body: {
            packageSource: repo.source,
            packageRepo: repo.repoUrl,
            packageName: repo.name
        }, method: 'POST'
    }).then(res => {
        console.log(res)
        console.log(installed)
        installed[repo.name] = res.body
    })
}
const 判定需要更新 = (repo) => {
    sac.路由管理器.internalFetch('/search/rss/meta', {
        body: {
            packageSource: repo.source,
            packageRepo: repo.repoUrl,
            packageName: repo.name
        }, method: 'POST'
    }).then(res => {
        if (res.body.version === repo.version) {
            updated[repo.name] = res.body
        }
    })
}
const openPackagePage = (repo) => {
    window.open(repo.repoUrl || repo.npmUrl)
}
</script>