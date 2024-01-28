<template>
    <div @mouseover.stop="stopUpdating" @mouseleave.stop="startUpdating" @click.stop="clickHandler">
        <div class="block__icons">
            <div class="block__logo">
                <svg class="block__logoicon">
                    <use xlink:href="#iconTips"></use>
                </svg>
                TIPS
            </div>
        </div>
        <template v-for="(item, i) in data">
            <div class="fn__flex-1 b3-card__info" v-if="mounted && data[i]" @mouseover="() => 高亮目标块(item)" style="
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
                                <input 
                                class=" fn__flex-center" 
                                type="checkbox" 
                                v-model="item.pined"
                                @change="切换钉住状态(item)"
                                >
                            </div>
                            <div class="fn__space "></div>
                        </div>
                        <div class="fn__flex fn__flex-1" style="max-height: 16vh;">
                            <div v-html="item.description" @click="item.pined=!item.pined">
                            </div>
                            <div class="fn__space fn__flex-1"> </div>

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
    </div>
</template>
<script setup>
import { onMounted, ref, inject } from 'vue';
import { openFocusedTipsByEvent } from '../events.js';
import { sac } from '../../runtime.js';
const data = ref(null);
const mounted = ref("")
const { appData } = inject('appData')
const isUpdating = ref(true);
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
function fetchData() {
    // 模拟数据获取
    if (!isUpdating.value) return; // 如果 isUpdating 为 false，则不更新数据
    let source = appData?.source || "all"
    let tips = sac.statusMonitor.get('tips', 'current').$value || []
    
    data.value = tips.filter(item => {
        return item && item.id && item.description && (item.source === source || source === 'all')
    }).slice(0, 20).sort((a, b) => {
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
function 高亮目标块(item) {
    if (item.targetBlocks) {
        item.targetBlocks.forEach(blockID => {
            let elements = document.querySelectorAll(`.protyle-wysiwyg.protyle-wysiwyg--attr [data-node-id="${blockID}"]`)
            elements.forEach(element => {
                element.style.backgroundColor = "yellow"; // 高亮样式
                setTimeout(() => {
                    element.style.backgroundColor = ""; // 移除高亮样式
                }, 500);
            });
        })
    }
}
function 切换钉住状态(item){
    if (item.pined) {
    item.scores.pined=Infinity
    let tips = sac.statusMonitor.get('tips', 'current').$value || [];
    // 找到item在tips中的位置
    let index = tips.findIndex(tip => tip === item);
        // 找到最后一个被pin的元素的位置
        let lastPinnedIndex = tips.lastIndexOf(tip => tip.pined);
        // 如果没有其他被pin的元素，那么item应该被移动到数组的开始
        if (lastPinnedIndex === -1) {
            lastPinnedIndex = 0;
        }
        // 移动item到最后一个被pin的元素的后面
        tips.splice(index, 1);
        tips.splice(lastPinnedIndex + 1, 0, item);
    }else{
        item.scores.pined=0
    }
}

</script>