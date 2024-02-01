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
import { 预览内容列表 } from "../../contentPreview/contentList.js";
import { kernelApi } from 'runtime'
let 内容列表 = ref(预览内容列表)
内容列表.value.forEach(
    listDefine => {
        if (listDefine.meta.contentFetcher) {
            (async () => {
                listDefine.content = await listDefine.meta.contentFetcher()
            })()
        }
    }
)
</script>