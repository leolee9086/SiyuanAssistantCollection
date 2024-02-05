<template>
    <div class="fn__flex-1 b3-card__info"  @mouseover="() => 高亮目标块(item)" style="
font-size:small !important;
background-color:var(--b3-theme-background);
padding:4px !important;
overflow-y:hidden;
border-bottom:1px dashed var(--b3-theme-primary-light)">
        <div class="b3-card__body protyle-wysiwyg protyle-wysiwyg--attr"
            style="font-size:small !important;padding:0">
            <div class="fn__flex fn__flex-column">
                <div class="fn__flex fn__flex-1">

                    <span class="sac-icon-actions" v-if="!item.type" style="color:var(--b3-theme-primary)">
                        <svg class="b3-list-item__graphic">
                            <use xlink:href="#iconSparkles"></use>
                        </svg>
                    </span>
                    <span class="sac-icon-actions" v-if="item.type === 'keyboardTips'"
                        style="color:var(--b3-theme-primary)">
                        <svg class="b3-list-item__graphic">
                            <use xlink:href="#iconKeymap"></use>
                        </svg>
                    </span>
                    <strong><a :href="item.link">{{ item.title }}</a></strong>

                    <strong :data-source="item.source">{{ item.source }}</strong>
                    <div class="fn__space fn__flex-1"> </div>

                    <div class=" ">
                        <input class=" fn__flex-center" type="checkbox" v-model="item.pined" @change="切换钉住状态(item)">
                    </div>
                    <div class="fn__space "></div>
                </div>
                <div class="fn__flex fn__flex-1" style="max-height: 16vh;">
                    <div v-html="item.description" @click="item.pined = !item.pined"
                        @click.right="(e) => 打开tips右键菜单(e, item)">
                    </div>
                    <div 
                    class="fn__space fn__flex-1"
                    @click.right="(e) => 打开tips右键菜单(e, item)"
                    > </div>

                    <div v-if="item.action">
                        <button @click="item.action" class="b3-button"
                            style="border-radius:15px;padding: 5px;margin: 5px;">
                            <svg class="b3-list-item__graphic">
                                <use xlink:href="#iconRight"></use>
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="fn__flex fn__flex-1">
                    <strong>{{ item.score ? (item.score * 10).toFixed(3) : item.score }}</strong>
                    <!--  <strong>{{ item }}</strong>-->
                    <strong>{{ item.pined }}</strong>
                    <div class="fn__space fn__flex-1">
                    </div>
                    <span class="b3-tooltips b3-tooltips__nw block__icon block__icon--show"
                        aria-label="Reply to message">
                        <svg>
                            <use xlink:href="#iconLike"></use>
                        </svg>
                    </span>
                    <span class="b3-tooltips b3-tooltips__nw block__icon block__icon--show"
                        aria-label="Reply to message">
                        <svg>
                            <use xlink:href="#iconLike" transform="scale(1, -1) translate(0, -14)"></use>
                        </svg>
                    </span>
                </div>

            </div>
            <template v-if="item.imageHTML">
                <div class="tips-image-container" v-html="item.imageHTML">
                </div>
            </template>
        </div>
    </div>
</template>
<script setup>
import {defineProps} from 'vue'
import { 高亮块元素 } from '../../../../utils/DOM/style.js'
import { 打开tips右键菜单 } from '../../UI/tipsContextMenu.js'
import { 切换钉住状态 } from '../../utils/item.js';
function 高亮目标块(item) {
    if (item.targetBlocks) {
        高亮块元素(item.targetBlocks)
    }
}
let {item} = defineProps(['item'])
</script>