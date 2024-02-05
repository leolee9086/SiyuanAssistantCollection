<template>
    <div class="fn__flex fn__flex-column" style="max-height: 100%;overflow-y: scroll;">
        <template v-for="(list,i) in 内容列表">
            <listTitle 
            @listFolded="() => foldList(list)" 
            @listUnFolded="() => unFoldList(list)" 
            @listItemFolded="()=>foldListItem(list)"
            v-if="list" 
            :listMeta="list">
            </listTitle>
            <div :class=genListClass(i) :style="`min-height: auto;max-height:${100 / 内容列表.length}%`">
                <div class="backlinkList fn__flex-1">
                    <ul class="b3-list b3-list--background">
                        <template v-if="list && list.content" v-for="listItemDefine in list.content"
                            :key="listItemDefine.id">
                            <listItem :itemDefine="listItemDefine"></listItem>
                        </template>
                    </ul>
                </div>
            </div>
        </template>
    </div>
</template>
<script setup>
import { ref } from "vue"
import listTitle from './contentList/listTitle.vue';
import listItem from './contentList/listItem.vue';
import { 预览内容表 } from "../../contentPreview/contentList.js";
import { kernelApi, sac } from 'runtime'
let 内容列表 = ref(预览内容表)
getContent()
function getContent() {
    内容列表.value.forEach(
        listDefine => {
            if (listDefine.meta.contentFetcher) {
                (async () => {
                    listDefine.content = (await listDefine.meta.contentFetcher()) || listDefine.content
                })()
            }
        }
    )
}
function genListClass(index){
    if(index<内容列表.value.length-1){
        return 'fn__flex fn__flex-column'
    }else{
        return 'fn__flex fn__flex-column fn__flex-1'
    }
}
function foldList(list) {
    list.content = []
}
function foldListItem(list){
    list.content&&list.content.forEach(
        item=>{
            if(item.fold&&item.previewer){
                
                item.fold()
            }        
        }
    )
}
async function unFoldList(list) {
    list.content = (await list.meta.contentFetcher()) || list.content
}
sac.eventBus.on('statusChange', (e) => {
    if (e.detail.name === 'contentList.current') {
        内容列表.value = e.detail.value
        getContent()
    }
})
</script>