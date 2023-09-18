// 获取模型的信息
async function 获取模型信息(模型名) {
    let url = `https://huggingface.co/${模型名}`;
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`获取模型信息失败: ${response.statusText}`);
    }
    return await response.json();
}

// 获取模型文件的下载URL
function 获取模型文件下载链接(模型信息, 文件名) {
    // 假设文件名对应于一个在模型信息中的文件
    return `https://huggingface.co/${模型信息.modelId}/resolve/main/${文件名}`;
}

// 下载模型文件
async function 下载模型文件(url, 文件名) {
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`下载模型文件失败: ${response.statusText}`);
    }
    let blob = await response.blob();
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 文件名;
    link.click();
}

// 主函数
async function 下载最新模型文件(模型名, 文件名) {
    let 模型信息 = await 获取模型信息(模型名);
    let 模型文件下载链接 = 获取模型文件下载链接(模型信息, 文件名);
    await 下载模型文件(模型文件下载链接, 文件名);
}

// 使用示例
