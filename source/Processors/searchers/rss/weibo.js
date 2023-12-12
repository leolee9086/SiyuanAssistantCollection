import { pluginInstance as plugin } from '../../asyncModules.js';
import { searchURL } from "./searcherWindow/electron.js";

const weiboSearchScript = `
Array.from(document.querySelectorAll('.card-wrap')).map(el => {
    const content = el.querySelector('.txt').innerText;
    const link = el.querySelector('.txt').href;
    return { content, link };
});
`;
const waitScript = `
document.querySelectorAll('.card-wrap').length;
`
// 创建一个回调函数，这个函数处理搜索结果
const handleWeiboSearchResults = (results, resolve, reject) => {
    if (results && results.length > 0) {
        resolve(results);
    } else {
        reject(new Error('No results found'));
    }
};
// 创建一个搜索微博的函数
export const searchWeibo = async (query) => {
    let searchUrl = `https://s.weibo.com/weibo/${encodeURIComponent(query)}`;
    let results = await searchURL(searchUrl, waitScript, weiboSearchScript, handleWeiboSearchResults);
    let markdown = ''
    results.forEach(result => {
        try {
            // 检查result.link是否是有效的URL
            new URL(result.link);
            // 对result.link进行编码以防止注入攻击
            let safeLink = encodeURI(result.link);
            // 添加到markdown
            markdown += plugin._lute ? `\n[${result.content}](${safeLink})` : '';
        } catch (e) {
            // 如果result.link不是有效的URL，URL构造函数会抛出一个错误
            console.error(`Invalid URL: ${result.link}`);
        }
    });
    // 将列表元素添加到 div 中
    // 解析 Promise，返回 div 和 markdown
    return markdown
};