import { pluginInstance as plugin } from "../../../asyncModules.js";
const cache = new Map();
export const serachBaidu= (text)=>{
    if(!window.require){
        return ''
    }
    return new Promise((resolve, reject) => {
        let searchUrl = `https://www.baidu.com/s?word=${encodeURIComponent(text)}`;
        let hiddenDiv = document.createElement('div');
        hiddenDiv.style.display = 'none';
        document.body.appendChild(hiddenDiv);
        hiddenDiv.innerHTML = `<webview id="webview" src="${searchUrl}" width="100%" height="300px"></webview>`;
        let webview = hiddenDiv.querySelector('#webview');
        let counter = 0;
        const maxAttempts = 10;
        const checkExist = setInterval(() => {
            if (counter >= maxAttempts) {
                clearInterval(checkExist);
                document.body.removeChild(hiddenDiv);
                reject(new Error('Maximum attempts reached'));
                return;
            }
            webview.executeJavaScript(`
                document.querySelectorAll('.result.c-container').length;
            `).then((length) => {
                if (length > 0) {
                    clearInterval(checkExist);
                    webview.executeJavaScript(`
                        Array.from(document.querySelectorAll('.result.c-container')).map(el => {
                            const title = el.querySelector('.c-title a').innerText;
                            const link = el.querySelector('.c-title a').href;
                            return { title, link };
                        });
                    `).then(results => {
                        // 创建一个列表元素来显示搜索结果
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
                            }                        });
                        // 将列表元素添加到 div 中
                        // 解析 Promise，返回 div 和 markdown
                        resolve( markdown );
                        // 移除隐藏的 div
                        try{
                            document.body.removeChild(hiddenDiv);
                        }catch(e){}
                    }).catch(e=>{
                        console.error(e)
                        reject(e)
    
                    });
                }
                counter++;
            });
        }, 100); // 每100毫秒检查一次
    });
}
/*
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
*/