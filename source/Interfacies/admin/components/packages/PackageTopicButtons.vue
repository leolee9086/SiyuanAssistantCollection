<template>
    <div class="fn__flex ">
        <div class="fn__space"></div>
        <div class="fn__space"></div>

        <div class="fn__space fn__flex-1">
            <template v-for="topicName in topics.value">
                <button data-type="myPlugin" :class="genClass(topicName)" @click="() => { changeTopic(topicName) }">{{
                    packageDefines.value[topicName] ? packageDefines.value[topicName].name
                    : topicName }}</button>
                <div class="fn__space"></div>
            </template>
            <button  class="b3-button b3-button--outline">  <svg >
                    <use xlink:href="#iconHTML5"></use>
                </svg>从网络添加</button>
                <button  class="b3-button b3-button--outline">  <svg >
                    <use xlink:href="#iconFile"></use>
                </svg>从文件添加</button>
        </div>
    </div>
    <div class="sac-rss-card">{{
        packageDefines.value[currentTopic.value] && packageDefines.value[currentTopic.value].descriptions &&
        packageDefines.value[currentTopic.value].descriptions.default }}</div>
</template>
<script setup>
import { defineEmits, reactive, defineProps } from 'vue'
import { sac } from 'runtime'
const { topic } = defineProps(['topic'])
let packageDefines = reactive({ value: {} })
const emit = defineEmits(['data-received', 'topic-change'])
const topics = reactive({
    value: [
        'plugin', 'theme', 'widget', 'icon', 'template'
    ]
})
const currentTopic = reactive({ value: topic || "siyuan-plugin" })
const changeTopic = (topic) => {
    currentTopic.value = topic
    emit('topic-change', topic)
    emit('data-received', [])
}
sac.路由管理器.internalFetch(`/packages/listPackageTypes`, {
    body: {
        page: 1
    }, method: 'POST'
}).then(res => {
    packageDefines.value = res.body.data
    topics.value = Object.keys(res.body.data)
})
sac.eventBus.on('statusChange', (e) => {
    if (e.detail && e.detail.name.startsWith(`packages`)) {
        sac.路由管理器.internalFetch(`/packages/listPackageTypes`, {
            body: {
                page: 1
            }, method: 'POST'
        }).then(res => {
            packageDefines.value = res.body.data
            topics.value = Object.keys(res.body.data)
        })
    }
})

const genClass = (topic) => {
    return currentTopic.value === topic ? "b3-button" : "b3-button b3-button--outline"
}
</script>