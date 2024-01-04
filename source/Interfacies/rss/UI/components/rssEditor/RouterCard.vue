<template>
    <div class="fn__flex-1 fn__flex b3-card b3-card--wrap sac-rss-card">
        <div class="b3-card-body fn__flex" style="font-size:small !important;padding:0">
            <div class="fn__flex fn__flex-column b3-card__info b3-card__info--left fn__flex-1" style="min-height: 1px;">
                <div>
                    路由:{{ router.endpoint }}
                </div>
                <div>
                    描述:{{ router.description }}
                </div>
            </div>
            <div class="b3-card__actions b3-card__actions--right">
                <span class="block__icon block__icon--show ariaLabel" aria-label="添加rss订阅" @click="添加订阅项目">
                    <svg>
                        <use xlink:href="#iconAdd"></use>
                    </svg>
                </span>
                <div>
                    <div class="block__icon block__icon--show ariaLabel" aria-label="设置访问这个端口所需要的权限">
                        <span>访问权限</span><input style="box-sizing: border-box" value="100" class="b3-slider fn__block" max="10" min="1" step="1" type="range">
                    </div>
                    <div class="block__icon block__icon--show ariaLabel" aria-label="允许伺服">
                        <span>允许伺服</span><input class="b3-switch fn__flex-center" checked="" data-type="plugin-enable" type="checkbox">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import defineProps from "vue"
import { sac } from "runtime";
let { router, adapter } = defineProps(['router','adapter'])
const 添加订阅项目 = () => {
    sac.事件管理器.emit('rss-ui', 'open-dialog', {
        type: 'initFeed',
        router: router,
        adapter: adapter
    })
}
</script>