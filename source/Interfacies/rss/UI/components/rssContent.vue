<template>
    <div>
      <div v-for="item in items" :key="item.link">
        <h2>{{ item.title }}</h2>
        <p v-html="safeContent(item.content)"></p>
        <a :href="item.link" target="_blank">Read more</a>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import Lute from 'lute';
  
  const items = ref([]);
  const lute = Lute.New();
  
  onMounted(async () => {
    const response = await fetch('https://example.com/rss');
    const text = await response.text();
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
    return lute.SpinVditorDOM(content);
  };
  </script>