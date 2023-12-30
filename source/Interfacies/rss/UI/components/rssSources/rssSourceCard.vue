<template>
    <div class="fn__flex-1 fn__flex b3-card b3-card--wrap sac-rss-card" :data-rss-name='item.name'>
        <div class="b3-card__body fn__flex" style="font-size:small !important;padding:0">
            <div class="b3-card__img">
                <svg style="width:74px;height:74px">
                    <use xlink:href="#iconRSS"></use>
                </svg>
            </div>
            <div class="fn__flex-1 ">
                <div class="fn__flex-1 fn__flex-column">
                    <div class="b3-card__info b3-card__info--left fn__flex-1">
                        <span class="ft__on-surface ft__smaller">{{ item.name }}</span>
                        <div class="b3-card__desc" :title="item.title">
                            {{ item.description }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="fn__space"></div>
            <div class="b3-card__actions b3-card__actions--right">
                <span class="block__icon block__icon--show ariaLabel" aria-label="编辑rss规则" @click.stop="editRule">
                    <svg>
                        <use xlink:href="#iconEdit"></use>
                    </svg>
                </span>
                <span class="block__icon block__icon--show ariaLabel" :data-rss-name='item.name' aria-label="查看内容"
                    @click="viewContent">
                    <svg>
                        <use xlink:href="#iconList"></use>
                    </svg>
                </span>
                <span class="block__icon block__icon--show ariaLabel" aria-label="允许伺服">
                    <input class="b3-switch fn__flex-center" :checked="item.enabled" data-type="plugin-enable"
                        type="checkbox" @change="toggleEnable">
                </span>
            </div>
        </div>
    </div>
</template>
<script setup>
import { defineProps, ref, onMounted } from 'vue'
import { sac } from 'runtime';
const props = defineProps({
    itemName: Object
})
const item = ref({})
onMounted(
    () => {
        sac.路由管理器.internalFetch('/search/rss/meta', {
            body: {
                packageName: props.itemName
            }, method: 'POST'
        }).then(res => {
            item.value = res.body
        })
    }
)
const editRule = () => {
    // 编辑规则的逻辑
    sac.eventBus.emit('rss-ui-open-tab', {
        title: props.itemName,
        icon: "iconRss",
        type: 'rssEditor',
        name: props.itemName
    })
}

const viewContent = () => {
    // 查看内容的逻辑
    let { feeds } = item.value
    sac.eventBus.emit('rss-ui-open-tab', {
        feed: Array.from(feeds),
        title: props.itemName,
        icon: "iconRss",
        type: 'rssGrid'
    })
}

const toggleEnable = () => {
    // 切换启用状态的逻辑

}
</script>