<template>
    <li class="b3-list-item b3-list-item--hide-action" data-node-id="20230118113834-r9ypxlj"
        data-notebook-id="20230118090131-82fwpy3" data-treetype="backlink" data-type="NodeDocument" data-subtype="">
        <span 
        style="padding-left: 4px;margin-right: 2px" 
        class="b3-list-item__toggle b3-list-item__toggle--hl"
        @click="()=>{fold(props.itemDefine)}"
        v-if="!folded"
        >
        <svg data-id="DeepPose0" class="b3-list-item__arrow b3-list-item__arrow--open">
                <use xlink:href="#iconRight"></use>
            </svg>
        </span>
        <span 
        style="padding-left: 4px;margin-right: 2px" 
        class="b3-list-item__toggle b3-list-item__toggle--hl"
        @click="()=>{unfold(props.itemDefine)}"
        v-if="folded"
        >
        <svg data-id="DeepPose0" class="b3-list-item__arrow ">
                <use xlink:href="#iconRight"></use>
            </svg>
        </span>
        <svg class="b3-list-item__graphic popover__block" data-id="20230118113834-r9ypxlj">
            <use xlink:href="#iconFile"></use>
        </svg>
        <span class="b3-list-item__text ariaLabel" data-position="parentE" aria-label="导入/DeepPose">
            {{ props.itemDefine.title }}
        </span>

        <span class="counter">1</span>
    </li>
    <div ref="container" data-defid="20230625002528-td23dsz" data-ismention="false" class="protyle" data-loading="finished"
        style="min-height: auto;">
    </div>
</template>
<script setup>
import { defineProps, watch, ref, onMounted } from 'vue'
const props = defineProps(["itemDefine"])
const container = ref(null)
const folded=ref(true)
onMounted(() => {
    if (props.itemDefine.def_block_id && container.value) {
        props.itemDefine._previewerDestroied=folded
    }
})
function fold(item){
    item.previewer.destroy()
    container.value.innerHTML=""
    folded.value=true
}
function unfold(item){
    item.previewer.init(container.value)
    folded.value=false
}

</script>