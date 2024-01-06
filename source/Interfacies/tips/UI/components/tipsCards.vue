<template>
    <template v-for="(item, i) in data" >
        <div class="fn__flex-1 b3-card__info" v-if="mounted&&data[i]" style="
font-size:small !important;
background-color:var(--b3-theme-background);
padding:4px !important;
max-height:16.66vh;
overflow-y:hidden;
border-bottom:1px dashed var(--b3-theme-primary-light)">
            <div class="b3-card__body protyle-wysiwyg protyle-wysiwyg--attr" style="font-size:small !important;padding:0">
                <div class="fn__flex fn__flex-column">
                    <div class="fn__flex fn__flex-1">
                        <span class="sac-icon-actions" data-action-id="${item.actionId}"
                            style="color:var(--b3-theme-primary)">
                            <svg class="b3-list-item__graphic">
                                <use xlink:href="#iconSparkles"></use>
                            </svg>
                        </span>
                        <strong><a href="${escapeHTML(item.link)}">{{ item.title }}</a></strong>
                        <div class="fn__space fn__flex-1">
                            <div class="fn__space "> </div>

                            <input class=" fn__flex-center" type="checkbox">
                        </div>
                        <strong :data-source="item.source">{{ item.source }}</strong>
                        <div class="fn__space "></div>
                    </div>
                    <div v-html="item.description">
                    </div>

                </div>
                <template v-if="item.imageHTML">
                    <div class="tips-image-container" :v-html="item.imageHTML">
                    </div>
                </template>
            </div>
        </div>
    </template>
</template>
<script setup>
import { onMounted, ref,inject} from 'vue';

const data = ref(null);
const mounted = ref("")
const {appData}=inject('appData')
onMounted(() => {
    requestIdleCallback(() => {
        // 这里执行闲时数据渲染逻辑
        fetchData();
    });
});

function fetchData() {
    // 模拟数据获取
    console.log(appData)
    let source=(appData&&appData.source)||"all"
    let tips = globalThis[Symbol.for('sac-tips')] || []
    data.value=tips.filter(item=>{
        return item&&item.id&&item.description&&(item.source===source||source==='all')
    }).slice(0, 20);
    if (data.value && data.value[0]) {
        mounted.value = true
    }
    requestIdleCallback(()=>{fetchData()},{deadline:1000})
}

</script>