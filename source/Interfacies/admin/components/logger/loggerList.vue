<template>
    <!-- 过滤器表单 -->
    <div class="filter-form">
        <select v-model="filter.name">
            <option value="">All names</option>
            <option v-for="name in uniqueLogNames" :key="name" :value="name">{{ name }}</option>
        </select> <select v-model="filter.level">
            <option value="">All levels</option>
            <option v-for="level in uniqueLogLevels" :key="level" :value="level">{{ level }}</option>
        </select>
    </div>
    <div class="virtual-scroll-container fn__flex-column fn__flex-1" ref="scrollContainer" @scroll="handleScroll">
        <div class="virtual-scroll-spacer" :style="{ height: totalHeight + 'px' }"></div>
        <template v-for="message in renderItems"  :key="message.id">
            <div  :style="getItemStyle(message)" :id="`item-${message.id}`" >
                <div>{{ message.name || "unknown" }}</div>
                <template v-for="(text, j) in message.messages" :key="j">
                    <div>{{ text }}</div>
                </template>
                <template v-for="(text, k) in message.stack" :key="k">
                    <div>{{ text }}</div>
                </template>
            </div>
        </template>
    </div>
</template>
  
<script setup>
import { ref, onMounted, computed, reactive, watch } from 'vue';
import { sac } from "runtime";
import { getColorForLogLevel } from './utils/messageColor.js';

const loggerItems = reactive([]);
const filter = reactive({ name: '', level: '' });

const scrollContainer = ref(null);
const itemHeights = reactive(new Map());
const levels = reactive(new Set())
const names = reactive(new Set())

const totalHeight = ref(0);

sac.eventBus.on('logger-add', (e) => {
    let { messages } = e.detail;
    if (Array.isArray(messages)) {
        messages.forEach(item => {
            item.id = item.id || Lute.NewNodeID();
            loggerItems.push(item);
            levels.add(item.level);
            names.add(item.name);
        });
    } else {
        messages.id = messages.id || Lute.NewNodeID();
        loggerItems.push(messages);
        levels.add(messages.level);
        names.add(messages.name);
    }
    // 检查loggerItems的长度，如果超过100，删除最早的日志项
    while (loggerItems.length > 100) {
        const removedItem = loggerItems.shift(); // 删除并获取数组的第一个元素
        // 可选：如果需要，更新levels和names集合
        // 这取决于是否需要从集合中删除不再存在于loggerItems中的项
    }
});
// 计算属性来收集所有不同的日志级别
const uniqueLogLevels = computed(() => {

    return Array.from(names);
});
const uniqueLogNames = computed(() => {

    return Array.from(levels);
});
// 更新 renderItems 计算属性以应用过滤器
const renderItems = computed(() => {
    return loggerItems
        .filter(item => {
            return (filter.name ? item.name.includes(filter.name) : true) &&
                (filter.level ? item.level === filter.level : true);
        })
        .reverse()
        .slice(0, 30);
});
const updateItemHeight = (message, el) => {
    if (el) {
        const height = el.clientHeight;
        itemHeights.set(message.id, height);
        totalHeight.value = Array.from(itemHeights.values()).reduce((sum, height) => sum + height, 0);
    }
};
const getItemStyle = (message) => {
    const index = loggerItems.indexOf(message);
    const top = loggerItems.slice(0, index).reduce((sum, item) => sum + (itemHeights.get(item.id) || 0), 0);
    return {
        color: getColorForLogLevel(message.level)
    };
};

const handleScroll = () => {
    // 由于项目高度是动态的，这里不需要更新任何状态
};

onMounted(() => {
    // 初始化项目高度
    loggerItems.forEach((message) => {
        updateItemHeight(message, document.getElementById(`item-${message.id}`));
    });
});

watch(loggerItems, (newItems, oldItems) => {
    // 当日志项变化时，更新项目高度
    newItems.forEach((message) => {
        if (!itemHeights.has(message.id)) {
            updateItemHeight(message, document.getElementById(`item-${message.id}`));
        }
    });
});
</script>
  
<style>
.virtual-scroll-container {
    overflow-y: auto;
    position: relative;
}

.virtual-scroll-spacer {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}

.virtual-scroll-list {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}

.virtual-scroll-item {
    box-sizing: border-box;
    border-bottom: 1px solid #eee;
}
</style>