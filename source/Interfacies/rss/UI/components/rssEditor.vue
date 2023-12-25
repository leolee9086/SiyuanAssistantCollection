<template>
    <div class="fn__flex-1 b3-cards">
        <div class="fn__flex-1 fn__flex b3-card b3-card--wrap sac-rss-card">
            <div class="b3-card-body fn__flex">
                <div class="fn__flex fn__flex-column b3-card__info b3-card__info--left fn__flex-1">
                    <div>
                        路由:{{ appData.data.name }}
                    </div>
                    <div>
                        描述:{{ appData.data.description }}
                    </div>
                </div>
            </div>
        </div>
        <template v-for="router in appData.data.routers">
            <div class="fn__flex-1 fn__flex b3-card b3-card--wrap sac-rss-card">
                <div class="b3-card-body fn__flex fn__flex-1">
                    <div class="fn__flex fn__flex-column b3-card__info b3-card__info--left fn__flex-1">
                        <div>
                            路由:{{ router.endpoint }}
                        </div>
                        <div>
                            描述:{{ router.description }}
                        </div>
                    </div>
                    <div class="b3-card__actions b3-card__actions--right">
                        <span class="block__icon block__icon--show ariaLabel" aria-label="添加rss订阅">
                            <svg>
                                <use xlink:href="#iconAdd"></use>
                            </svg>
                        </span>
                     
                        <span class="block__icon block__icon--show ariaLabel" aria-label="允许伺服">
                            <input class="b3-switch fn__flex-center" checked="" data-type="plugin-enable" type="checkbox">
                        </span>
                    </div>
                </div>
            </div>
        </template>
        <template v-for="feed in appData.data.feeds">
            <div class="fn__flex-1 fn__flex b3-card b3-card--wrap sac-rss-card">
                <div class="b3-card-body fn__flex">
                    <div class="fn__flex fn__flex-column b3-card__info b3-card__info--left fn__flex-1">
                        <div>
                            {{ feed.title }}
                        </div>
                        <div>
                            路由:{{ feed.path }}
                        </div>
                        <div>
                            描述:{{ feed.description }}
                        </div>
                        <div>
                            更新规则:{{feed.timer}}
                            <cronEditor v-model="feed.timer"></cronEditor>
                        </div>
                        {{feed}}
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>
<script setup>
import { inject } from 'vue'
import cronEditor from '../../../../UI/components/cronEditor.vue'
const appData = inject('appData');
console.error(appData)
</script>