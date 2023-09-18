// 获取最新发布版本的信息
async function 获取最新发布版本信息(所有者, 仓库) {
    let url = `https://api.github.com/repos/${所有者}/${仓库}/releases/latest`;
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`获取最新发布版本失败: ${response.statusText}`);
    }
    return await response.json();
}

// 获取文件的下载URL
function 获取文件下载链接(发布版本, 文件名) {
    let 文件资源 = 发布版本.assets.find(asset => asset.name === 文件名);
    if (!文件资源) {
        throw new Error(`${文件名} 在最新发布版本中未找到.`);
    }
    return 文件资源.browser_download_url;
}

// 下载文件
async function 下载文件(url, 文件名) {
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`下载文件失败: ${response.statusText}`);
    }
    let blob = await response.blob();
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 文件名;
    link.click();
}

// 主函数
async function 下载最新发布版本文件(所有者, 仓库, 文件名) {
    let 发布版本 = await 获取最新发布版本信息(所有者, 仓库);
    let 文件下载链接 = 获取文件下载链接(发布版本, 文件名);
    await 下载文件(文件下载链接, 文件名);
}

// 使用示例
下载最新发布版本文件('octocat', 'Hello-World', 'example.zip')
    .catch(error => console.error(error));