## Features

This is a practical function and AI assistant geometry plugin (SiyuanAssistantCollection), not meaning Stand Alone Complex.

It mainly consists of some practical small functions and some AI assistant interface docking.

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

This simple vector database does not have a server and uses the file interface of Siyuan.

#### Model selection

Currently, the effect and performance of shibing624/text2vec-base-chinese are more suitable under experiment.

In order to be more convenient to use on the web, a quantized version has been made.

### Real-time word segmentation menu and word segmentation tips generation

Calculate available reference materials and functions while inputting, using multiple anti-shake and AbortController to ensure content generation performance. The current test is basically available when there are 280,000 content blocks. (i5 10400,32g).

We will continue to optimize the performance here. Real-time menus and real-time references are the basis of AI assistance.

### Calculation method

Generate menus through user-defined action generation tables. Menu items with lower generation performance will be blocked when users input quickly.

So you can use a little more menu items.

### Action list example

Located in the installed/actionList folder, you can try to write your own action table

## Protocol

Please refer to their respective protocols for the external dependencies used. There is no time to list them for the time being.
In addition, use AGPL-3.0-or-later, for the content of the agreement, refer to the official website and the license file in this folder.

## Thanks

The vector embedding part uses the transformers.js library

The vector embedding part uses shibing624's text2vec-base-chinese model

Word segmentation depends on jieba and pinyin

## Others

About the beam design: We are actually doing interior design (well, architectural planning, landscape and garden are also done), if you don't believe it, you can see our Little Red Book and Zhihu, if someone wants to do interior design, you can contact us~~~

In addition, if you think this thing is useful, you can invite us to have a cup of coffee. There should be a QR code below, but they are broken. Wait for me to get the picture bed. Well, this is the begging link of Aifadian: https://afdian.net/a/leolee9086

![Alipay]('./assets/AlipayQRCode1.jpg')

![WeChat]('./assets/WeChatQRCode1.jpg')