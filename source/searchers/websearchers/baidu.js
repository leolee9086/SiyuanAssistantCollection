import * as cheerio from '../../../static/cheerio.js'
import {got} from '../../utils/network/got.js'
let searchHistory = {};
let lastSearchTime = {};
let delay = 3000;
export const searchBaidu = async (query, options = {rss: false}) => {
    if (Date.now() - lastSearchTime < delay) {
        return options.rss ? {results: searchHistory[query] || [], markdown: ''} : '';
    }
    let searchUrl = `https://www.baidu.com/s?wd=${query}`;
    let pn = 0;
    if (searchHistory[query]) {
        pn = searchHistory[query].length ;
        searchUrl += `&pn=${pn}`;
    }
    let response = await got(searchUrl);
    let $ = cheerio.load(response.data);
    if ($('title').text().includes('百度安全验证')) {
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
        let uniqueResults = [...new Set([...searchHistory[query], ...results])];
        searchHistory[query] = uniqueResults;
    } else {
        searchHistory[query] = results||[];
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
    lastSearchTime = Date.now();
    return options.rss ? {results: searchHistory[query], markdown} : markdown;
};

window.searchBaidu=searchBaidu
