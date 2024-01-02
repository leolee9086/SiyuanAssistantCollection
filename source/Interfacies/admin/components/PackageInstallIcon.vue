<template>
    <span 
    class="block__icon block__icon--show ariaLabel" 
    aria-label="查看详情" 
    @click="()=>{installPackage(packageInfo)}">
        <svg>
            <use xlink:href="#iconDownload"></use>
        </svg>
    </span>
</template>
<script setup> 
import { defineProps,defineEmits } from 'vue'

import { install } from '../utils/package.js';
const emit = defineEmits(['package-installed'])
const { packageInfo } = defineProps(['packageInfo'])
const installPackage=async(packageInfo)=>{
    let res = await install(packageInfo)   
    emit('package-installed',res) 
}
</script>