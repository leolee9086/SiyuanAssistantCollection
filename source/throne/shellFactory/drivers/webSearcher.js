import { pluginInstance as plugin } from "../../../asyncModules.js";
const cache = new Map();

async function searchWithTokens(query) {
    const tokens = plugin.jieba.tokenize(query, "search");
    let links = [];

    for (let token of tokens) {
        if (cache.has(token.word)) {
            links.push(cache.get(token.word));
        } else {
            const link = await queryWikipediaCN(token.word) || await queryDouban(token.word);
            cache.set(token.word, link);
            links.push(link);
        }
    }
    return links.join(", ");
}
// 1. 维基百科中文版
async function queryWikipediaCN(query) {
    const WIKIPEDIA_CN_API_URL = "https://zh.wikipedia.org/w/api.php";
    const params = new URLSearchParams({
        action: "query",
        format: "json",
        list: "search",
        srsearch: query,
        origin: "*"
    });

    const response = await fetch(`${WIKIPEDIA_CN_API_URL}?${params}`);
    const data = await response.json();

    if (data.query.search[0]) {
        const page_title = data.query.search[0].title;
        return `[${page_title}](https://zh.wikipedia.org/wiki/${encodeURIComponent(page_title)})`;
    } else {
        return "No results found.";
    }
}
// 2. 豆瓣API
async function queryDouban(query) {
    const DOUBAN_API_URL = "https://api.douban.com/v2/book/search";
    const params = new URLSearchParams({
        q: query
    });

    const response = await fetch(`${DOUBAN_API_URL}?${params}`);
    const data = await response.json();

    if (data.books[0]) {
        const book_title = data.books[0].title;
        return `[${book_title}](${data.books[0].alt})`;
    } else {
        return "No results found.";
    }
}
//1. 维基百科中文版: 维基百科中文版提供了一个API供开发者查询数据。维基百科中文版API

//2. 豆瓣API: 豆瓣API提供了电影、图书和音乐等信息的查询。豆瓣API

//3. 百度百科: 百度百科是一个中文的在线百科全书，但是它并没有公开的API。你可以通过爬虫来获取数据，但是请注意遵守相关法律法规。

//4. 中文维基库（Chinese Wikicorpus）: 这是一个中文的维基百科语料库，它提供了维基百科的中文文章的文本数据。中文维基库

//5. 开放中文知识图谱（OpenKG）: OpenKG是一个开放的中文知识图谱，它提供了各种领域的知识数据。开放中文知识图谱
