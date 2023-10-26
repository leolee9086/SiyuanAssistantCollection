## Note

This plugin is still in the early stages of development, please be sure to pay attention to data safety when using it.

After the initial installation, indexing may take a long time, and the whitelist and blacklist filtering of indexing is under development.

## Features

This is a practical function and AI assistant collection plugin (SiyuanAssistantCollection), not the meaning of Stand Alone Complex.

Mainly some practical small functions, and some AI assistant interface docking.

## Composition

### Vector data generation, storage and query

#### Data structure

Since some attributes are not suitable to be placed in the Siyuan database (because all custom attributes will be rendered to the DOM), we have created a new key-value pair storage.

For all objects with IDs in Siyuan, their attribute content can be extended through this KV storage.

#### Data synchronization

Data synchronization plans to use websocket. When any front-end webpage updates data, it will do these things:

1. Broadcast to remind all ends to update the local database instance via websocket.

2. Copy the new database to disk for storage

#### Performance optimization

In order to achieve better performance, all data will be stored in a json file according to the value of ID modulo 8.

When the corresponding ID is queried, it will use K-nearest neighbor retrieval to query the nearest 1000 IDs and load them into memory. The retrieval vector comes from embedding.

#### Server and client

This simple vector database has no server and uses the file interface of Siyuan.

#### Model selection

Currently, the effect and performance of using shibing624/text2vec-base-chinese are more suitable under experiment.

In order to be more convenient to use on the web, a quantized version has been made. It is pulled from my gitee repository in the Chinese environment and from huggingface in the English environment.

### Real-time word segmentation menu and word segmentation tips generation

Calculate available reference materials and functions while inputting, using multiple debounces and AbortController to ensure content generation performance. The current test is basically usable when there are 280,000 content blocks (i5 10400,32g).

The performance here will continue to be optimized in the future, and real-time menus and real-time references are the basis of AI assistance.

### Calculation method

Generate menus through user-defined action generation tables. Menu items with low generation performance will be blocked when users input quickly.

So you can use relatively more menu items.

### Action list example

Located in the installed/actionList folder, you can try to write your own action table

#### Format

All action table files must have a default export, which can be an action list generation function or an action list