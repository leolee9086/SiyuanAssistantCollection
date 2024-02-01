<template>
    <div class="b3-card__img">
        <img v-if="repo.iconUrl" style="width:74px;height:74px" :src="repo.iconUrl" />
        <svg v-if="!repo.iconUrl" style="width:74px;height:74px">
            <use xlink:href="#iconRSS"></use>
        </svg>
    </div>
</template>
<script setup>
import {defineProps} from "vue"
const {repo,altImage}=defineProps(["repo","altImage"])
</script>