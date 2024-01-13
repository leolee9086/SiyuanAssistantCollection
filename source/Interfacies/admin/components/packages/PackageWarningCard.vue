<template>
    <div class="fn__flex fn__flex-1 b3-card sac-rss-card "
        style="color: var(--b3-card-warning-color);background-color: var(--b3-card-warning-background);">
        <div class=" b3-card-body b3-card-info fn__flex-column  fn__flex protyle-wysiwyg protyle-wysiwyg--attr">
            <div class="sac-font-size-large h2">
                <span>
                    <svg style="width:1rem;height:1rem;">
                        <use xlink:href="#iconSacWarning"></use>
                    </svg>
                </span>
                <strong>警告:
                    扩展包能够带来很多便利,但是也会有一些风险,请务必注意以下问题
                </strong>
            </div>

            <ul class="sac-list">
                <li>扩展可能造成你的数据损坏</li>
                <li>扩展可能造成思源的性能下降</li>
                <li>过多扩展可能使你的工作流程变得难以控制</li>
            </ul>
            <p>
                在开始使用这一类型的扩展之前,你需要确认以下事项:
            </p>

            <ul class="sac-list">
                <li>务必不要安装任何你不清楚作用的扩展,以免造成不必要的问题</li>
                <li>有关扩展的issue请到扩展包或者提供加载功能的插件等的仓库提出</li>
            </ul>
            <div class="fn__space fn__flex-1"></div>
            <div>
                <button class="b3-button" @click="enablePackageType">我已经知晓</button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { defineProps,defineEmits } from 'vue'
import {enable} from '../../utils/package.js'
let { topic } = defineProps(['topic'])
const emit=defineEmits(['topic-enabled'])
const enablePackageType = async () => {
    let res = await enable(topic)
    if (res.body&&res.body.data && res.body.data.enabled) {
        emit('topic-enabled',{topic: topic})
    }
}


</script>
<style scoped>
.sac-rss-card {
    padding: 32px
}

.sac-list {
    padding-left: 28px
}

.sac-font-size-large {
    font-size: larger;
}
</style>
