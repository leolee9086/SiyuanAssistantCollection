<template>
    <div class="block__icons">
        <div class="block__logo">
            <svg>
                <use xlink:href="#iconFiles"></use>
            </svg>
            tips
        </div>
    </div>
    <div class="fn_flex-1">
        <template v-for="(动作,i) in tips" >
            <div class="tips-card">
                <div class="fn__flex-1 fn__flex-column">
                    <div class="b3-card__info b3-card__info--left fn__flex-1">
                        {{动作.label}} <span class="ft__on-surface ft__smaller">{{动作.describe || ""}}</span>
                        <div class="b3-card__body">
                            <template v-html="动作.tipRender(context)"></template>
                        </div>
                    </div>
                    <div>Tips for block: <a href="siyuan://blocks/${执行上下文.blocks[0].id}">${执行上下文.blocks[0].id}</a></div>
                </div>
            </div>
        </template>
    </div>
</template>
<script setup>
import { plugin } from 'runtime';
import { ref } from 'vue';
let tips = ref([])
let context= ref({})
plugin.eventBus.on('hint_tips_render',(e)=>{
    tips.value=tips.value.concat(e.detail.备选动作表)
    tips.value.length>=50?tips.value.shift():null
    context.value = e.detail.context
})
</script>