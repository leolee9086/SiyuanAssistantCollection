<template>
    <div class="fn__flex-1 b3-cards">
        <AppCard :app="appData.config" />
        <RouterCard v-for="router in appData.config.routers" :key="router.endpoint" :router="router" :adapter="appData.meta.name" />
        <FeedCard v-for="feed in appData.config.feeds" :key="feed.path" :feed="feed" />
    </div>
</template>
<script setup>
import { inject } from 'vue'
import AppCard from './rssEditor/AppCard.vue'
import RouterCard from './rssEditor/RouterCard.vue'
import FeedCard from './rssEditor/FeedCard.vue'
const appData = inject('appData');
</script>