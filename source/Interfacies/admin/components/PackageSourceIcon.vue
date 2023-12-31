<template>
    <span class="block__icon block__icon--show ariaLabel" aria-label="查看详情" @click="()=>{openRemote(packageInfo)}">
        <svg>
            <use v-bind="{ 'xlink:href': genIcon(packageInfo) }"></use>
        </svg>
    </span>
</template>
<script setup>
import { defineProps, ref, onMounted } from 'vue'
const { packageInfo } = defineProps(['packageInfo'])
const iconUrl = ref(''); // Create a reactive data property
onMounted(() => {
    iconUrl.value = genIcon(packageInfo); // Call genIcon after the component is mounted
});
const genIcon = (packageInfo) => {
    let source = packageInfo.source;
    if (!source && packageInfo.url) {
        if (packageInfo.url.indexOf('npm') !== -1) {
            source = 'npm';
        } else if (packageInfo.url.indexOf('github') !== -1) {
            source = 'github';
        } else if (packageInfo.url.indexOf('huddingface') !== -1) {
            source = 'huddingface';
        }
    }
    switch (source) {
        case 'npm':
            return '#iconNPM';
        case 'github':
            return '#iconGithub';
        case 'huddingface':
            return '#iconHuddingface';
        default:
            return '#iconDefault';
    }
}
const openRemote = (packageInfo)=>{
    console.log(packageInfo)
    window.open(packageInfo.url)
}