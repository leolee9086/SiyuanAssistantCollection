<template>
    <li class="b3-list-item b3-list-item--hide-action" data-node-id="20230118113834-r9ypxlj"
        data-notebook-id="20230118090131-82fwpy3" data-treetype="backlink" data-type="NodeDocument" data-subtype="">
        <span style="padding-left: 4px;margin-right: 2px" class="b3-list-item__toggle b3-list-item__toggle--hl">
            <svg data-id="DeepPose0" class="b3-list-item__arrow b3-list-item__arrow--open">
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
const previewers = ref({})
onMounted(() => {
    console.log(props.itemDefine,props.itemDefine.def_block_id, container.value)
    if (props.itemDefine.def_block_id && container.value) {
        let previewer = props.itemDefine.previewer(container.value)
        previewers.value[props.itemDefine.id]=previewer
    }
})
watch(
    props, (newVal, oldVal) => {

        console.log(newVal, oldVal)
    }, { deep: true }
)
</script>