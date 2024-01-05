<template>
  <CcGrid class="rss-card-grid fn__flex-1" :items="items">
    <template v-for="(item,i) in items" :key="item.link">
      <div class="rss-card" @click="() => openContent(item,i)">
        <h2 class="rss-card__title">{{ item.title }}</h2>
        <p class="rss-card__content" v-html="safeContent(item.content)"></p>
        <a :href="item.link" target="_blank" class="rss-card__link">打开来源页</a>
      </div>
    </template>

  </CcGrid>
</template>
<script setup>
import { ref, onMounted, inject } from 'vue';
import { sac } from 'runtime'
import { fetchFeed } from '../utils/feed.js';
import {CcGrid} from '../../../../UI/components/ccGrid.js';
import cronEditor from '../../../../UI/components/cronEditor.vue';
console.log(CcGrid,cronEditor)
const items = ref([]);
const lute = Lute.New();
const { feed } = inject('appData')
onMounted(async () => {
  if (Array.isArray(feed)) {
    for (let _feed of feed) {
      let feedItems = await fetchFeed(_feed.path);
      feedItems= feedItems.map(
        item=>{
          item.path = _feed.path
          return item
        }
      )
      items.value=items.value.concat(feedItems);
      console.log(items.value)
    }
  } else {
    items.value = await fetchFeed(feed.path);
  }
});

const safeContent = (content) => {
  return lute.SpinBlockDOM(content);
};

const openContent = (item,i) => {
  let data = {
    path:feed.path||item.path,
    item:i,
    title: item.title,
    icon: item.icon || "",
    type: 'rssContent',
  }
  console.log(data)
  sac.eventBus.emit('rss-ui-open-tab',data )
}
</script>

<style scoped>
.rss-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-auto-rows: 300px;
  gap: 20px;
  padding: 20px;
}

.rss-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.rss-card__title {
  font-size: 20px;
  font-weight: bold;
}

.rss-card__content {
  font-size: 16px;
  overflow-x: auto;
  overflow-y: hidden;
}

.rss-card__link {
  color: #0078d4;
  text-decoration: none;
  align-self: flex-end;
}

.rss-card__link:hover {
  text-decoration: underline;
}
</style>