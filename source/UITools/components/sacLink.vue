<template>
    <router-link v-bind="$attrs">
        <slot>{{ linkText }}</slot>
    </router-link>
</template>

<script setup>
import { ref } from 'vue';

const linkText = ref('Default Text'); // 你的链接文本

</script>