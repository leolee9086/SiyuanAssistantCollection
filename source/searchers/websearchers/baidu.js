import * as cheerio from '../../../static/cheerio.js'
import {got} from '../../utils/network/got.js'
let searchHistory = {};
let lastSearchTime = {};
let delay = 3000;
export const searchBaidu = async (query, options = {rss: false}) => {
    // 检查是否在3秒内已经搜索过这个关键词
    if (lastSearchTime[query] && Date.now() - lastSearchTime[query] < delay) {
        // 如果在3秒内已经搜索过，直接返回历史结果
        return searchHistory[query] ? {results: searchHistory[query], markdown: ''} : '';
    }
    let searchUrl = `https://www.baidu.com/s?wd=${query}`;
    let pn = 0;
    if (searchHistory[query]) {
        pn = searchHistory[query].length ;
        searchUrl += `&pn=${pn}`;
    }
    let response = await got(searchUrl);
    let $ = cheerio.load(response.data);
    console.log(response.data)

    if ($('title').text().includes('百度安全验证')) {
        // 如果出现了，指数级增加搜索间隔
        delay *= 2;
        return '';
    }
    let results = [];
    $('.result.c-container').each((index, element) => {
        const title = $(element).find('.c-title a').text();
        const link = $(element).find('.c-title a').attr('href');
        results.push({ title, link });
    });
    if (searchHistory[query]) {
        searchHistory[query] = [...searchHistory[query], ...results];
    } else {
        searchHistory[query] = results;
    }
    let markdown = '';
    searchHistory[query].forEach(result => {
        try {
            new URL(result.link);
            let safeLink = encodeURI(result.link);
            result.link = safeLink;
            markdown +=  `\n[${result.title}](${safeLink})` 
        } catch (e) {
            console.error(`Invalid URL: ${result.link}`,e);
        }
    });
    // 记录这次搜索的时间
    lastSearchTime[query] = Date.now();
    if(options.rss){
        return {results: searchHistory[query], markdown};
    }
    return markdown;
};

window.searchBaidu=searchBaidu
