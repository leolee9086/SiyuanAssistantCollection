import { sac } from "../../../../asyncModules.js";
export const fetchFeed = async (feedPath) => {
    const response = await sac.路由管理器.internalFetch('/search/rss/feed/', {
        method: "POST",
        body: {
            format: 'xml',
            path: feedPath
        }
    });
    const text = await response.body;
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'application/xml');
    const nodes = doc.querySelectorAll('item');
    let result = Array.from(nodes).map(node => ({
      title: node.querySelector('title').textContent,
      content: node.querySelector('description').textContent,
      link: node.querySelector('link').textContent
    }));
    return  result
}