// 创建隐藏的div和webview
function createHiddenWebview(url) {
    let hiddenDiv = document.createElement('div');
    hiddenDiv.style.display = 'none';
    document.body.appendChild(hiddenDiv);
    hiddenDiv.innerHTML = `<webview id="webview" src="${url}" width="100%" height="300px"></webview>`;
    return hiddenDiv.querySelector('#webview');
}

// 清理资源
function cleanup(checkExist, hiddenDiv) {
    clearInterval(checkExist);
    hiddenDiv.remove()
}

// 执行脚本并处理结果
function executeScript(webview, wait, script, cb, resolve, reject, counter, checkExist) {
    webview.executeJavaScript(wait).then(
        result => {
            if (result) {
                webview.executeJavaScript(script)
                    .then((results) => {
                        cb(results, resolve, reject);
                        cleanup(checkExist, webview.parentElement);
                    })
                    .catch((error) => {
                        reject(error);
                        cleanup(checkExist, webview.parentElement);

                    });
                counter++;
            }

        }

    )
}


// 主函数
export const searchURL = (url, wait, script, cb, maxAttempts = 10) => {
    if (!window.require) {
        return Promise.reject(new Error('window.require is not available'));
    }
    return new Promise(async (resolve, reject) => {
        let webview = createHiddenWebview(url);
        let counter = 0;
        const checkExist = setInterval(() => {
            if (counter >= maxAttempts) {
                cleanup(checkExist, webview.parentElement);
                reject(new Error('Maximum attempts reached'));
                return;
            }
            executeScript(webview, wait, script, cb, resolve, reject, counter, checkExist);
        }, 100); // 每100毫秒检查一次
        setTimeout(() => { 
            cleanup(checkExist, webview.parentElement) 
            reject(new Error('timeout'))
        }, 3000)
    });
};


