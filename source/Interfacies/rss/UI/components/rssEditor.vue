<template>
    <div class="fn__flex-1 b3-cards">
        <AppCard :app="appData.data" />
        <RouterCard v-for="router in appData.data.routers" :key="router.endpoint" :router="router" :adapter="appData.name" />
        <FeedCard v-for="feed in appData.data.feeds" :key="feed.path" :feed="feed" />
    </div>
</template>
<script setup>
import { inject } from 'vue'
import AppCard from './AppCard.vue'
import RouterCard from './RouterCard.vue'
import FeedCard from './FeedCard.vue'
const appData = inject('appData');
</script>