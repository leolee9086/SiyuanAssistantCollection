<template>
    <div>
        <h3>编辑订阅标题</h3>
        <input v-model="title" />

        <h3>编辑订阅路径</h3>
        <template v-for="(part, index) in routeParts" :key="index">
            <div v-if="part && isParam(part)">
                <label>
                    Param {{ getParamName(part) }}:
                    <input v-model="userInputs[index]" />
                </label>
            </div>
        </template>
        <button @click="generateRoute">Generate Route</button>
        <p>Generated Route: {{ generatedRoute }}</p>
        <h3>编辑描述</h3>
        <textarea v-model="description"></textarea>

        <h3>编辑订阅更新规则</h3>
        <cron-editor v-model="cronRule"></cron-editor>

        <h3>阅读权限等级</h3>
        <label>此处的权限级别可以限制AI或者外部用户能否读取RSS内容</label>
        <input type="number" min="1" max="10" v-model.number="accessLevel">
        <button @click="addRssFeed">确定</button>
    </div>
</template>
  
<script setup>
import { ref, computed, inject } from 'vue';
import cronEditor from '../../../../UI/components/cronEditor.vue'
import { sac } from 'runtime'

const appData = inject('appData');
const router = appData.router;

const routeParts = ref(getParamsFromRoute(router.endpoint));
console.log(routeParts)
const userInputs = ref(routeParts.value.map(() => ''));
const generatedRoute = computed(() => routeParts.value.map((part, index) => isParam(part) ? userInputs.value[index] : part).join('/'));

function getParamsFromRoute(route) {
    return route.split('/');
}

function isParam(part) {
    return part.startsWith(':');
}

function getParamName(part) {
    return part.slice(1);
}

function generateRoute() {
    generatedRoute.value;
}
const description = ref('');
const cronRule = ref('');
const title = ref('');

// 新增的数据属性
const accessLevel = ref(10);
function addRssFeed(){
    console.log(appData,cronRule)
    console.log(
        {
            packageName:appData.adapter,
            path:generatedRoute._value,
            timer:cronRule._value||"0 30 * * * *",
            description,
            title:title._value
        }
    )
    sac.路由管理器.internalFetch('/search/rss/addFeed',{
        method:'POST',
        body:{
            packageName:appData.adapter,
            path:generatedRoute._value,
            timer:cronRule._value||"0 30 * * * *",
            description,
            title:title._value
        }
    })
}
</script>