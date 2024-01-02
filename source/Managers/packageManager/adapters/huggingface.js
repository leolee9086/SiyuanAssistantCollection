

import { got } from '../runtime.js';
import { fs, path } from '../runtime.js';
import cheerio from "../../../../static/cheerio.js";
const HUB_URL = "https://huggingface.co";
async function getPackagesByKeyword(keyword) {
    const task = keyword;
    const library = 'transformers.js';
    let models = [];
    for (let i = 0; i < 20; i++) {
        const url = `${HUB_URL}/models?pipeline_tag=${encodeURIComponent(task)}&library=${library}&page=${i}`;
        const response = await got(url);

        const $ = cheerio.load(response.body);
        // 使用cheerio获取模型信息，这里需要根据实际的HTML结构来写
        $('.overview-card-wrapper').each((index, element) => {
            const model = {
                name: $(element).find('h4').text().trim(),
                url: HUB_URL + $(element).find('a').attr('href'),
                updated: $(element).find('time').attr('datetime'),
                downloads: $(element).find('svg').next().text().trim(),
                likes: $(element).find('svg').next().next().next().text().trim()
            };
            models.push(model);
        });
    }
    console.log(models)
    return models;
}
export async function getReposInfoByTopic(keyword) {
    const models = await getPackagesByKeyword(keyword);
    return models.map(model => {
        return {
            url: `${HUB_URL}/${model.modelId}`,
            updated: model.lastModified, // This information is available from the model data
            stars: null, // This information is not available from the model data
            openIssues: null, // This information is not available from the model data
            size: null, // This information is not available from the model data
            topic: keyword,
            package: {
                name: model.name,
                author: model.author, // This information is available from the model data
                url: model.url,
                version: null, // This information is not available from the model data
                minAppVersion: null, // This information is not available from the model data
                backends: null, // This information is not available from the model data
                frontends: null, // This information is not available from the model data
                displayName: {
                    default: model.modelId,
                    zh_CN: null, // This information is not available from the model data
                    en_US: null // This information is not available from the model data
                },
                description: {
                    default: model.description, // This information is available from the model data
                    zh_CN: null, // This information is not available from the model data
                    en_US: null // This information is not available from the model data
                },
                readme: null, // This information is not available from the model data
                funding: {
                    openCollective: null, // This information is not available from the model data
                    patreon: null, // This information is not available from the model data
                    github: null, // This information is not available from the model data
                    custom: null // This information is not available from the model data
                },
                keywords: null, // This information is not available from the model data
                source: "huggingface",
                topic: keyword,
            }
        };
    });
}
async function downloadFile(fileUrl, localPath) {
    const fileResponse = await got(fileUrl, { responseType: 'buffer' });
    await fs.writeFile(localPath, fileResponse.body);
}

async function downloadDirectory(modelName, dirPath, localPath) {
    const url = `https://huggingface.co/api/models/${modelName}/tree/main/${dirPath}`;
    const response = await got(url);
    const repoInfo = JSON.parse(response.body);

    for (const item of repoInfo) {
        const itemLocalPath = path.join(localPath, item.path);
        if (item.type === 'file') {
            const fileUrl = `https://huggingface.co/${modelName}/resolve/main/${item.path}`;
            await downloadFile(fileUrl, itemLocalPath);
        } else if (item.type === 'directory') {
            await fs.mkdir(itemLocalPath, { recursive: true });
            await downloadDirectory(modelName, item.path, itemLocalPath);
        }
    }
}

export async function downloadModelRepo(modelName, installPath) {
    await downloadDirectory(modelName, '', installPath);
    return {
        success: true
    };
}
export async function installPackageZip(installPath, modelName) {
    // 获取模型信息
    const url = `${HUB_URL}/${modelName}/resolve/main/config.json`;
    const response = await got(url);
    const modelInfo = JSON.parse(response.body);
    await downloadModelRepo(
        modelName, installPath
    )
    return {
        modelInfo,
        success: true
    }
    /*// 获取模型文件的 URL
    const fileUrl = modelInfo.model_file;

    // 下载模型文件
    const fileResponse = await got(fileUrl, { responseType: 'buffer' });

    // 写入到临时路径
    const tempPath = `/temp/noobTemp/bazzarPackage/${modelName}.bin`;
    await fs.writeFile(tempPath, fileResponse.body);

    // 解压缩模型文件
    await kernelApi.unzip({
        zipPath: tempPath,
        path: installPath
    });

    // 如果只有一个文件夹，且文件夹名为 "package" 或与外部文件夹同名
    const files = await fs.readDir(installPath);
    if (files.length === 1 && (files[0].name === 'package' || files[0].name === modelName)) {
        const folderPath = path.join(installPath, files[0].name);
        const folderFiles = await fs.readDir(folderPath);
        // 将文件夹的内容移动到 installPath
        for (const file of folderFiles) {
            const oldPath = path.join(folderPath, file.name);
            const newPath = path.join(installPath, file.name);
            await fs.copyFile(oldPath, newPath);
        }
        // 删除空的文件夹
        await fs.removeFile(folderPath);
    }

    return {
        modelInfo,
        success: true
    };*/
}


