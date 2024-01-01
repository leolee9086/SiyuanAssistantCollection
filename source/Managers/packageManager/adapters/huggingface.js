

import { got } from '../runtime.js';
import { fs, path } from '../runtime.js';

// 获取模型的信息
async function getModelInfo(modelName) {
    const url = `https://huggingface.co/api/models/${modelName}`;
    const response = await got(url);
    return JSON.parse(response.body);
}

// 下载模型
async function downloadModel(url, modelName) {
    const response = await got(url);
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${modelName}.tar.gz`;
    link.click();
}

// 主函数
export async function downloadLatestModel(modelName) {
    const modelInfo = await getModelInfo(modelName);
    const modelDownloadUrl = modelInfo.download_url;
    await downloadModel(modelDownloadUrl, modelName);
}

export async function installModel(installPath, modelName) {
    const modelInfo = await getModelInfo(modelName);
    const modelDownloadUrl = modelInfo.download_url;
    const tempPath = `/temp/noobTemp/huggingface/${modelName}.tar.gz`;
    await downloadModel(modelDownloadUrl, modelName);
    await kernelApi.unzip({
        zipPath: tempPath,
        path: installPath
    });
}

export async function uninstallModel(installPath, modelName) {
    const modelPath = path.join(installPath, modelName);
    await fs.removeFile(modelPath);
}