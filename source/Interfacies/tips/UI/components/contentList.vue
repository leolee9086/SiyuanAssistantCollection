<template>
    <template v-for="list in 内容列表">
        <listTitle v-if="list" :listMeta="list"></listTitle>
        <div class="backlinkList fn__flex-1">
            <ul class="b3-list b3-list--background">
                <template 
                v-if="list && list.content" 
                v-for="listItemDefine in list.content"
                :key="listItemDefine.id">
                    <listItem :itemDefine="listItemDefine"></listItem>
                </template>
            </ul>
        </div>
    </template>
</template>
<script setup>
import { ref } from "vue"
import listTitle from './contentList/listTitle.vue';
import listItem from './contentList/listItem.vue';
import { 预览内容表 } from "../../contentPreview/contentList.js";
import { kernelApi,sac } from 'runtime'
let 内容列表 = ref(预览内容表)
getContent()
function getContent(){
    内容列表.value.forEach(
    listDefine => {

        if (listDefine.meta.contentFetcher) {
            (async () => {
                listDefine.content = (await listDefine.meta.contentFetcher())||listDefine.content
                console.log(listDefine)
            })()
        }
    }
)
}
sac.eventBus.on('statusChange',(e)=>{
    if(e.detail.name==='contentList.current'){
        内容列表.value=e.detail.value
        getContent()
    }
})
</script>