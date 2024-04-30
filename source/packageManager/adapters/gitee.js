// 获取最新发布版本的信息
export function 获取最新发布版本信息(所有者, 仓库) {
    let url = `https://gitee.com/api/v5/repos/${所有者}/${仓库}/releases/latest`;
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`获取最新发布版本信息失败: ${response.statusText}`);
            }
            return response.json();
        });
}

// 获取文件的下载URL
export function 获取文件下载链接(发布版本, 文件名) {
    let 文件资源 = 发布版本.assets.find(asset => asset.name === 文件名);
    if (!文件资源) {
        throw new Error(`${文件名} 在最新发布版本中未找到.`);
    }
    return 文件资源.browser_download_url;
}

// 触发下载
function 触发下载(response, 文件名) {
    return response.blob()
        .then(blob => {
            // 创建一个 File 对象
            let file = new File([blob], 文件名);
            // 返回 File 对象
            return file;
        });
}

// 主函数
function 下载最新发布版本文件(所有者, 仓库, 文件名) {
    console.log('开始')
    let 对话框 = new DownloadDialog('/public/onnxModels.zip', 'test.zip');
}