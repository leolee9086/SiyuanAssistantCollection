<template>
    <label class="fn__flex b3-label config__item">
        <div class="fn__flex-1">
            <div class="fn__flex">
                在右侧输入URL
                <span class="fn__space"></span>
            </div>
            <div class="b3-label__text">选择外观使用的图标</div>
        </div>
        <span class="fn__space"></span>
        <div class="fn__flex">
        <input class="b3-text-field fn__flex-center fn__size200"   @change="($event)=>{url.value=$event.target.value}">
        <button  class="fn__flex-center b3-button b3-button--outline fn__size200" id="authCode" 
        @click="()=>{从URL解析集市包列表(url.value)}">
            <svg>
                <use xlink:href="#iconRefresh"></use>
            </svg>解析
        </button>
        </div>
    </label>
</template>
<script setup>
import { reactive } from 'vue';
const url=reactive({})
const  从URL解析集市包列表=(url)=>{
    if(url){
        console.log(url)
    }
}
</script>