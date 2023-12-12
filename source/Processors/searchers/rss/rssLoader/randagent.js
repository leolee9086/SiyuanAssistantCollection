import path from '../../../../polyfills/path.js'
import fs from '../../../../polyfills/fs.js';
// src/helpers.ts
var randomElement = function(array) {
    let index = Math.floor(
      Math.random() * (array[Object.keys(array).pop()].maxIndex + 1)
    );
    for (let [userAgent, indexes] of Object.entries(array)) {
      if (index >= indexes.minIndex && index <= indexes.maxIndex) {
        return userAgent;
      }
    }
    return "No Agent Found";
  };
  var JSONIsFrequency = function(json) {
    const [userAgent, frequency] = Object.entries(json[Object.keys(json)[0]])[0];
    return !isNaN(frequency);
  };
  var JSONfrequencyNormalize = function(content2) {
    let contentParsed = {};
    for (let key in content2) {
      contentParsed[key] = {};
      let sortedFrequencies = Array.from(
        new Set(Object.values(content2[key]))
      ).sort();
      for (let [userAgent, frequency] of Object.entries(content2[key])) {
        contentParsed[key][userAgent] = sortedFrequencies.indexOf(frequency) + 1;
      }
    }
    return contentParsed;
  };
  var JSONinterval = function(content2) {
    let contentParsed = {};
    for (let key in content2) {
      contentParsed[key] = {};
      let minIndex = 0;
      for (let [userAgent, frequency] of Object.entries(content2[key])) {
        contentParsed[key][userAgent] = {
          minIndex,
          maxIndex: minIndex + frequency - 1
        };
        minIndex = minIndex + frequency;
      }
    }
    return contentParsed;
  };
  
  // src/index.ts
 let content = await fetch(import.meta.url.replace('randagent.js','')+'/user-agents.json')
 content =await content.json()
 content = JSONfrequencyNormalize(content);
  if (JSONIsFrequency(content)) {
    content = JSONinterval(content);
  }
  var randUserAgent = function(device, browser = null, os = null) {
    let options = [];
    const keys = Object.keys(content);
    for (const index in keys) {
      let filter = true;
      if (keys[index].indexOf(device) === -1) {
        filter = false;
      }
      if (browser && keys[index].indexOf(browser) === -1) {
        filter = false;
      }
      if (os && keys[index].indexOf(os) === -1) {
        filter = false;
      }
      if (filter) {
        options.push(keys[index]);
      }
    }
    if (options.length === 0) {
      return randomElement(content);
    }
    return randomElement(
      content[options[Math.floor(Math.random() * options.length)]]
    );
  };
  export {
    randUserAgent
  };