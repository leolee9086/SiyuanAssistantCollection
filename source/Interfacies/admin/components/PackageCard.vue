<template>
    <div class="fn__flex-1 fn__flex b3-card b3-card--wrap sac-rss-card" data-repo-name=''>
        <div class="b3-card__body fn__flex" style="font-size:small !important;padding:0">
            <div class="b3-card__img">
                <img v-if="repo.iconUrl" style="width:74px;height:74px" :src="repo.package.iconUrl" />
                <svg v-if="!repo.iconUrl" style="width:74px;height:74px">
                    <use xlink:href="#iconRSS"></use>
                </svg>
            </div>
            <div class="fn__flex-1 fn__flex-column">
                <div class="b3-card__info b3-card__info--left fn__flex-1">
                    <span class="ft__on-surface ft__smaller">{{ repo.package.name }}</span>
                    <div class="b3-card__desc" :title="repo.package.name">
                        {{ repo.package.name }}
                    </div>
                </div>
                            <div class="b3-card__actions b3-card__actions--right">
                <span v-if="!installed[repo.package.name]" class="block__icon block__icon--show ariaLabel" aria-label="安装"
                   data-repo-source="github"
                    >
                    <svg>
                        <use xlink:href="#iconDownload"></use>
                    </svg>
                </span>
                <span v-if="!updated[repo.package.name]" class="block__icon block__icon--show ariaLabel" aria-label="更新"
                     data-repo-source="github">
                    <svg>
                        <use xlink:href="#iconRefresh"></use>
                    </svg>
                </span>
                <span v-if="installed[repo.package.name]" class="block__icon block__icon--show ariaLabel" aria-label="卸载"
                  data-repo-source="github"
                    >
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
    </div>
</template>
<script setup>
import { defineProps } from 'vue'
const { repo } = defineProps(['repo'])
</script>