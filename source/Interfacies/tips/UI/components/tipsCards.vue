<template>
    <div @mouseover.stop="stopUpdating" @mouseleave.stop="startUpdating" @click.stop="clickHandler">
        <div class="block__icons">
            <div class="block__logo">
                <svg class="block__logoicon">
                    <use xlink:href="#iconTips"></use>
                </svg>
                TIPS
            </div>
            <div class="fn__space"></div>
            <input v-model="query"/>

        </div>
        <div class="block__icons">
            <select @change="e => currentSourcies.push(e.target.value)" v-if="difference.length > 1&&currentSourcies[0]">
                <option v-for="source in difference" :value="source">{{ source }}</option>
            </select>
            <button 
            class="b3-button b3-button--outline" 
            style="border:1px dashed ;"
            v-if="difference.length === 1"
                @click="currentSourcies.push(difference[0])">
                {{ difference[0] }}
                <div class="fn__space"></div>
                <svg class="block__logoicon" style="width:8px;height: 8px;">
                    <use xlink:href="#iconClose"></use>
                </svg>
            </button>
            <template v-for="(source, i) in tipsSourcies" v-if="!currentSourcies[0]">
                <div class="fn__space"></div>
                <button class="b3-button b3-button--outline" @click="currentSourcies.push(source)">
                    {{ source }}
                    <div class="fn__space"></div>
                    <svg class="block__logoicon" style="width:8px;height: 8px;">
                        <use xlink:href="#iconClose"></use>
                    </svg>
                </button>
            </template>
            <template v-for="(source, i) in currentSourcies">
                <div class="fn__space"></div>
                <button class="b3-button b3-button--outline" @click="currentSourcies.splice(i, 1)">
                    {{ source }}
                    <div class="fn__space"></div>
                    <svg class="block__logoicon" style="width:8px;height: 8px;">
                        <use xlink:href="#iconClose"></use>
                    </svg>
                </button>
            </template>
        </div>
        <template v-for="(item, i) in data" :key="item.id+i">
            <tipsCard :item="item"></tipsCard>
        </template>
    </div>
</template>
<script setup>
import { onMounted, ref, inject, computed } from 'vue';
import { openFocusedTipsByEvent } from '../events.js';
import { sac } from '../../runtime.js';
import tipsCard from './tipsCard.vue'
const data = ref(null);
const mounted = ref("")
const { appData } = inject('appData')
const isUpdating = ref(true);
const query =ref('')
const currentSourcies = ref([])
if (appData?.source) {
    currentSourcies.value.push(appData.source)
}
const tipsSourcies = ref([])
const difference = computed(() => {
    return tipsSourcies.value.filter(source => !currentSourcies.value.includes(source));
});
let clickHandler = (event) => {
    openFocusedTipsByEvent(event, data.value)
}

onMounted(() => {
    requestAnimationFrame(() => {
        // 这里执行闲时数据渲染逻辑
        fetchData();
    });
});

function stopUpdating(e) {
    if (e.target === e.currentTarget) {
        isUpdating.value = false;
    }
}

function startUpdating(e) {
    if (e.target === e.currentTarget) {
        isUpdating.value = true;
    }
}
function filter(item){
    let flag = item && item.id && item.description && (currentSourcies.value.includes(item.source) || currentSourcies.value.length === 0)

    return flag && String(item.description).indexOf(String(query.value)) > -1;
}
function fetchData() {
    // 主要是为了实现暂停tips的刷新
    if (!isUpdating.value) return; // 如果 isUpdating 为 false，则不更新数据
    let tips = sac.statusMonitor.get('tips', 'current').$value || []
    tipsSourcies.value = Array.from(new Set(tips.map(item => { return item.source })))
    data.value = tips.filter(filter).slice(0, 20).sort((a, b) => {
        if (a.pined !== b.pined) {
            return a.pined ? -1 : 1;
        } else {
            return b.score - a.score;
        }
    });
    if (data.value && data.value[0]) {
        mounted.value = true
    }
    requestAnimationFrame(() => { fetchData() }, { deadline: 1000 })
}

</script>