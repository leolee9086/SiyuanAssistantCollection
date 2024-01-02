<template>
    <span 
    class="block__icon block__icon--show ariaLabel" 
    aria-label="查看详情" 
    @click="()=>{install(packageInfo)}">
        <svg>
            <use xlink:href="#iconDownload"></use>
        </svg>
    </span>
</template>
<script setup> 
import { defineProps,defineEmits } from 'vue'
import { sac } from 'runtime';
const emit = defineEmits(['package-installed'])
const { packageInfo } = defineProps(['packageInfo'])
const install=(packageInfo)=>{
    console.log(packageInfo)
    let {topic} = packageInfo
    sac.路由管理器.internalFetch(`/packages/${topic}/install`, {
        body: packageInfo, method: 'POST'
    }).then(res => {
        emit('package-istalled',res)
    })
}
</script>