export default [
    {
        label: "百度搜索",
        hints: '搜索',
        matchMod: 'any',
        icon: "",
        tipRender: (context) => {
            return new Promise((resolve, reject) => {
                let searchUrl = `https://m.baidu.com/s?word=${encodeURIComponent(context.blocks[0].content)}`;
                let div = document.createElement('div');
                let hiddenDiv = document.createElement('div');
                hiddenDiv.style.display = 'none';
                document.body.appendChild(hiddenDiv);
                hiddenDiv.innerHTML = `<webview id="webview" src="${searchUrl}" width="100%" height="300px"></webview>`;
                let webview = hiddenDiv.querySelector('#webview');
        
                webview.addEventListener('dom-ready', function() {
                    webview.executeJavaScript(`
                        // 在这里写你的脚本，获取你想要的内容
                        // 例如，获取所有的搜索结果条目
                        Array.from(document.querySelectorAll('.result.c-container')).map(el => {
                            const title = el.querySelector('.c-title a').innerText;
                            const link = el.querySelector('.c-title a').href;
                            return { title, link };
                        });
                    `).then(results => {
                        // 创建一个列表元素来显示搜索结果
                        let ul = document.createElement('ul');
                        results.forEach(result => {
                            let li = document.createElement('li');
                            li.innerHTML = `<a href="${result.link}" target="_blank">${result.title}</a>`;
                            ul.appendChild(li);
                        });
                        // 将列表元素添加到 div 中
                        div.appendChild(ul);
                        // 解析 Promise，返回 div 和 markdown
                        resolve({ element: div, markdown: "" });
                        // 移除隐藏的 div
                        document.body.removeChild(hiddenDiv);
                    }).catch(reject);
                });
            });
        }
    }
]