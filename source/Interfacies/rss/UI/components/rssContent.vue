<template>
  <div class="rss-card-grid fn__flex-1">
    <template v-for="item in items" :key="item.link">
      <div class="rss-card">
        <h2 class="rss-card__title">{{ item.title }}</h2>
        <p class="rss-card__content" v-html="safeContent(item.content)"></p>
        <a :href="item.link" target="_blank" class="rss-card__link">阅读更多</a>
      </div>
    </template>
  </div>
</template>
<script setup>
import { ref, onMounted, inject } from 'vue';
import { sac } from 'runtime'
const items = ref([]);
const lute = Lute.New();
const { feed } = inject('appData')
console.log(feed)
onMounted(async () => {
  const response = await sac.路由管理器.internalFetch('/search/rss/feed/', {
    method: "POST",
    body: {
      format: 'xml',
      path: feed.path
    }
  });
  const text = await response.body;
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'application/xml');
  const nodes = doc.querySelectorAll('item');
  items.value = Array.from(nodes).map(node => ({
    title: node.querySelector('title').textContent,
    content: node.querySelector('description').textContent,
    link: node.querySelector('link').textContent
  }));
});

const safeContent = (content) => {
  return lute.SpinBlockDOM(content);
};
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