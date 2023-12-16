import ctx from './ctxPolyfills.js';
import rssV1router from './routeMapV1.js'

export const parseRss = (path, options) => {
    let url
    try{
     url = new URL(path);
    }catch(e){
         url = new URL(location.origin+path)
    }
    const pathWithQuery = url.pathname + url.search;  // "/zhihu/zhuanlan/googledevelopers?query=example"
    let _ctx = ctx(pathWithQuery, options)
    return new Promise((resolve, reject) => {
        try {
            rssV1router.routes('/')(_ctx, () => {
                let xml = `<?xml version="1.0" encoding="UTF-8" ?>
                <rss version="2.0">
                <channel>
                    <title>${_ctx.state.data.title}</title>
                    <link>${window.loaction.host}${path}</link>
                    <description>${_ctx.state.data.description}</description>`;

                // 添加数据到feed
                _ctx.state.data.item.forEach(item => {
                    xml += `
                    <item>
                        <title>${item.title}</title>
                        <link>${item.url}</link>
                        <description>${item.description}</description>
                        <pubDate>${item.date}</pubDate>
                    </item>`;
                });

                xml += `
                </channel>
                </rss>`;

                resolve(xml);

            });
        } catch (e) {
            reject(e)
        }
    })
}
