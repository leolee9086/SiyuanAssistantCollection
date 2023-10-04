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
                        }
                        counter++;
                    });
                }, 100); // 每100毫秒检查一次
            });
        }
    }
]