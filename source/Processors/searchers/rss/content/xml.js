import xmlBuilder from "../../../../../static/xmlBuilder.js";
export function buildFeedXML(feedJson, path) {
    if (feedJson) {
        let rss = xmlBuilder.create('rss', { version: '1.0', encoding: 'UTF-8' })
            .att('version', '2.0')
            .ele('channel')
            .ele('title', {}, feedJson.title)
            .up()
            .ele('link', {}, `${window.location.host}/search/rss/feed/${path}`)
            .up()
            .ele('description', {}, feedJson.description)
            .up();
        // 添加数据到feed
        feedJson.item.forEach(item => {
            rss.ele('item')
                .ele('title', {}, item.title)
                .up()
                .ele('link', {}, item.link)
                .up()
                .ele('description', {}, item.description)
                .up()
                .ele('pubDate', {}, item.pubDate)
                .up();
        });
        return rss.end({ pretty: true });
    }else{
        throw new Error(`路径${path}渲染错误,需要有效的rss内容以构建xml`)
    }
}
