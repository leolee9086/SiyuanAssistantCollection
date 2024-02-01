<template>
    <div class="b3-card__info b3-card__info--left fn__flex-1">
        <span class="ft__on-surface ft__smaller">{{ repo.package.name }}</span>
        <div class="b3-card__desc" title="${repo.name}">
            {{ getDescription(repo.package) }}
        </div>
        <div class="b3-card__desc" title="${repo.name}">
            {{ repo.package.version }}
        </div>
    </div>
</template>
<script setup>
import {defineProps} from "vue"
const {repo} = defineProps(['repo'])
const getDescription = (packageInfo) => {
    let description = packageInfo.description
    description = description || "没有描述"
    if (description[siyuan.config.language]) {
        description = description[siyuan.config.language]
    } else if (description.default) {
        description = description.default
    }
    return description
}
</script>