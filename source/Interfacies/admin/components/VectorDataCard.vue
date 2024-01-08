<template>
    <div class="vector-item" v-if="vectorData">
      <h2>Vector ID: {{ vectorData.id }}</h2>
      <div class="vector-details">
        <h3>Feature Vector:</h3>
        <ul>
          <li v-for="(value, index) in vectorData.vector" :key="index">
            Dimension {{ index + 1 }}: {{ value }}
          </li>
        </ul>
        <h3>Quality Scores:</h3>
        <ul>
          <li v-for="(value, key) in vectorData.qualityScores" :key="key">
            {{ key.charAt(0).toUpperCase() + key.slice(1) }}: {{ value }}
          </li>
        </ul>
        <h3>Sources:</h3>
        <ul>
          <li><strong>Primary:</strong> <a :href="vectorData.sources.primary" target="_blank">{{ vectorData.sources.primary }}</a></li>
          <li v-for="source in vectorData.sources.secondary" :key="source">
            <strong>Secondary:</strong> <a :href="source" target="_blank">{{ source }}</a>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'VectorItem',
    props: {
      vectorData: {
        type: Object,
        required: true
      }
    }
  }
  </script>
  
  <style scoped>
  .vector-item {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin: 20px;
  }
  
  .vector-details h3 {
    margin-top: 10px;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 5px;
  }
  </style>