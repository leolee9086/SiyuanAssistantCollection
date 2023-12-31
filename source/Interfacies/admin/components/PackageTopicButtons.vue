<template>
    <div class="fn__flex">
        <div class="fn__space"></div>
        <div class="fn__space"></div>
        <template v-for="topicName in topics.value">
            <button data-type="myPlugin" :class="genClass(topicName)"
                @click="() => { changeTopic(topicName) }">{{ topicName }}</button>
            <div class="fn__space"></div>

        </template>

        <svg class="svg ft__on-surface fn__flex-center">
            <use xlink:href="#iconSort"></use>
        </svg>
        <div class="fn__space fn__flex-1"></div>
        <select class="b3-select">
            <option selected="" value="0">更新时间降序</option>
            <option value="1">更新时间升序</option>
            <option value="2">下载次数降序</option>
            <option value="3">下载次数升序</option>
        </select>
        <div class="fn__space"></div>
        <div class="b3-form__icon">
            <svg class="b3-form__icon-icon">
                <use xlink:href="#iconSearch"></use>
            </svg>
            <input class="b3-text-field b3-form__icon-input" placeholder="Enter 搜索">
        </div>

        <div class="fn__space"></div>
        <div class="counter fn__flex-center b3-tooltips b3-tooltips__w" aria-label="总计"
            style="background: var(--b3-theme-surface)">34</div>
        <div class="fn__space"></div>
        <div class="fn__space"></div>
    </div>
</template>
<script setup>
import { defineEmits, reactive } from 'vue'
import { sac } from 'runtime'
const emit = defineEmits(['data-received', 'topic-change'])
const topics = reactive({
    value: [
        'plugin', 'theme', 'widget', 'icon', 'template'
    ]
})
const currentTopic = reactive({ value: "plugin" })
sac.路由管理器.internalFetch(`/packages/listPackageTypes`, {
    body: {
        page: 1
    }, method: 'POST'
}).then(res => {
    console.log("包类型更新:", res.body)
    topics.value = Object.keys(res.body.data)
})
sac.eventBus.on('statusChange', (e) => {
    console.log(e)
    if (e.detail && e.detail.name.startsWith(`packages`)) {
        sac.路由管理器.internalFetch(`/packages/listPackageTypes`, {
            body: {
                page: 1
            }, method: 'POST'
        }).then(res => {
            console.log("包类型更新:", res.body)
            topics.value = Object.keys(res.body.data)
        })
    }
})
const changeTopic = (topic) => {
    currentTopic.value = topic
    console.log(topic)
    sac.路由管理器.internalFetch(`/packages/${topic}/listRemote`, { method: "POST" }).then(
        data => {
            console.log(data.body)
            emit('data-received', data.body)
        }
    )
}
const genClass = (topic) => {
    return currentTopic.value === topic ? "b3-button" : "b3-button b3-button--outline"
}
</script>