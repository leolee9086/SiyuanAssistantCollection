<template>
    <div class="block__icons">
        <div class="block__logo">
            <svg class="block__logoicon">
                <use xlink:href="#iconLink"></use>
            </svg>{{props.listMeta.name}}
        </div>
        <span class="counter listCount fn__none" style="margin-left: 0">1</span>
        <span class="fn__flex-1"></span>
        <span class="fn__space"></span>
        <input class="b3-text-field search__label fn__none fn__size200" placeholder="关键字过滤 Enter">
        <span data-type="search" class="block__icon b3-tooltips b3-tooltips__sw" aria-label="筛选"><svg>
                <use xlink:href="#iconFilter"></use>
            </svg></span>
        <span class="fn__space"></span>
        <span data-type="refresh" class="block__icon b3-tooltips b3-tooltips__sw" aria-label="刷新"><svg class="">
                <use xlink:href="#iconRefresh"></use>
            </svg></span>
        <span class="fn__space"></span>
        <span data-type="sort" data-sort="3" class="block__icon b3-tooltips b3-tooltips__sw" aria-label="排序"><svg>
                <use xlink:href="#iconSort"></use>
            </svg></span>
        <span class="fn__space"></span>
        <span data-type="expand" class="block__icon b3-tooltips b3-tooltips__sw" aria-label="展开 Ctrl+↓">
            <svg>
                <use xlink:href="#iconExpand"></use>
            </svg>
        </span>
        <span class="fn__space"></span>
        <span 
        @click="foldListItem"
        data-type="collapse" 
        class="block__icon b3-tooltips b3-tooltips__sw" 
        aria-label="折叠 Ctrl+↑">
            <svg>
                <use xlink:href="#iconContract"></use>
            </svg>
        </span>
        <span class="fn__space"></span>
        <span 
        @click="foldList" 
        class="block__icon b3-tooltips b3-tooltips__sw" 
        aria-label="最小化 Ctrl+W"
        v-if="!folded"
        >
            <svg>
                <use xlink:href="#iconMin"></use>
            </svg>
        </span>
        <span 
        @click="unFoldList" 
        class="block__icon b3-tooltips b3-tooltips__sw" 
        aria-label="最小化 Ctrl+W"
        v-if="folded"
        >
            <svg>
                <use xlink:href="#iconAdd"></use>
            </svg>
        </span>
    </div>
</template>
<script setup>
    import {defineProps,defineEmits,ref} from 'vue'
    const props = defineProps(['listMeta'])
    const folded = ref(null)
    const emits = defineEmits(["listFolded","listUnFolded",'listItemFolded'])
    const foldList =()=>{
        folded.value=true
        emits('listFolded')
    } 
    const unFoldList = ()=>{
        folded.value = false
        emits('listUnFolded')
    }
    const foldListItem=()=>{
        emits('listItemFolded')
    }
    
</script>