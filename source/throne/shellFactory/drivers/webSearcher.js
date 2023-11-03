import { pluginInstance as plugin } from "../../../asyncModules.js";
import { searchURL } from "./searcherWindow/electron.js";
const baiduSearchScript = `
Array.from(document.querySelectorAll('.result.c-container')).map(el => {
    const title = el.querySelector('.c-title a').innerText;
    const link = el.querySelector('.c-title a').href;
    return { title, link };
});
`;
const waitScript = `
document.querySelectorAll('.result.c-container').length;
`
// 创建一个回调函数，这个函数处理搜索结果
const handleBaiduSearchResults = (results, resolve, reject) => {
    if (results && results.length > 0) {

        resolve(results);
    } else {
        reject(new Error('No results found'));
    }
};

// 创建一个搜索百度的函数
export const searchBaidu = async (query) => {
    let searchUrl = `https://www.baidu.com/s?word=${encodeURIComponent(query)}`;
    let results = await searchURL(searchUrl, waitScript, baiduSearchScript, handleBaiduSearchResults);
    let markdown = ''
    results.forEach(result => {
        try {
            // 检查result.link是否是有效的URL
            new URL(result.link);
            // 对result.link进行编码以防止注入攻击
            let safeLink = encodeURI(result.link);
            // 添加到markdown
            markdown += plugin._lute ? `\n[${result.title}](${safeLink})` : '';
        } catch (e) {
            // 如果result.link不是有效的URL，URL构造函数会抛出一个错误
            console.error(`Invalid URL: ${result.link}`);
        }
    });
    // 将列表元素添加到 div 中
    // 解析 Promise，返回 div 和 markdown
    return markdown
};
plugin.searchers.set
    ('baidu', {
        search: searchBaidu
})
