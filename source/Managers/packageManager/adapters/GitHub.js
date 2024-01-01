import { got } from "../runtime.js";
import { download } from "../downloader/downloader.js";
import { kernelApi } from "../runtime.js";
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
export async function 下载最新发布版本文件(所有者, 仓库, 文件名) {
    let 发布版本 = await 获取最新发布版本信息(所有者, 仓库);
    let 文件下载链接 = 获取文件下载链接(发布版本, 文件名);
    await 下载文件(文件下载链接, 文件名);
}
export async function getReposByTopic(topic) {
    const url = `https://api.github.com/search/repositories?q=topic:${topic}`;
    const response = await got(url);
    return response.data.items;
}

// GitHub adapter
export async function getReposInfoByTopic(topic, metaFile) {
    const repos = await getReposByTopic(topic);
    return Promise.all(repos.map(async repo => {
        const baseUrl = `https://github.com/${repo.owner.login}/${repo.name}/raw/master`;
        let releaseData = {}
        try {
            const releaseUrl = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/releases/latest`;
            const releaseResponse = await got(releaseUrl);
            releaseData = JSON.parse(releaseResponse.body);
        } catch (e) {
            console.warn(e, '未能正确获取包数据',repo)

            return undefined
        }
        let metaData = {}
        try {
            // Fetch the metaFile
            const metaFileUrl = `https://raw.githubusercontent.com/${repo.owner.login}/${repo.name}/master/${metaFile}`;
            const metaFileResponse = await got(metaFileUrl);
            metaData = await metaFileResponse.json();
        } catch (e) {
            console.warn(e, '未能正确获取包数据',repo)
        }
        return {
            url: `https://github.com/${repo.owner.login}/${repo.name}@${releaseData.tag_name}`,
            updated: releaseData.published_at,
            stars: repo.stargazers_count,
            openIssues: repo.open_issues_count,
            size: repo.size,
            topic:topic,
            package: {
                name: repo.name,
                author: repo.owner.login,
                url: `https://github.com/${repo.owner.login}/${repo.name}`,
                version: releaseData.tag_name,
                minAppVersion: metaData.minAppVersion || null,
                backends: metaData.backends || null,
                frontends: metaData.frontends || null,
                displayName: metaData.displayName || {
                    default: repo.name,
                    zh_CN: null,
                    en_US: null
                },
                description: metaData.description || {
                    default: repo.description,
                    zh_CN: null,
                    en_US: null
                },
                readme: metaData.readme || {
                    default: `${baseUrl}/README.md`,
                    zh_CN: null,
                    en_US: null
                },
                funding: metaData.funding || {
                    openCollective: null,
                    patreon: null,
                    github: null,
                    custom: null
                },
                keywords: metaData.keywords || null,
                topic:topic,
                source:'github'
            }
        };
    }));
}
export async function installPackageZip(installPath, packageName, repo,packageInfo) {
    //@todo:支持安装特定版本
    //let version =packageInfo.version?'tag/'+ packageInfo.version:'latest'
    let version='latest'
    const response = await fetch(`https://api.github.com/repos/${repo.replace('https://github.com/', '')}/releases/${version}`);
    const data = await response.json();
    const zipAsset = data.assets.find(asset => asset.name === 'package.zip');
    if (zipAsset) {
        const fileURL = zipAsset.browser_download_url;
        const tempPath = `/temp/noobTemp/bazzarPackage/${packageName}@${packageInfo.version}.zip`;
        await download(fileURL, tempPath);
        await kernelApi.unzip({
            zipPath: tempPath,
            path: installPath
        });
    }
}


export async function installSingleFile(installPath, packageName, repo, packageInfo) {
    let version = 'latest';
    const response = await fetch(`https://api.github.com/repos/${repo.replace('https://github.com/', '')}/releases/${version}`);
    const data = await response.json();
    const files = data.assets;

    // 遍历所有文件
    for (const file of files) {
        const fileURL = file.browser_download_url;
        const tempPath = `/temp/noobTemp/bazzarPackage/${file.name}`;
        await download(fileURL, tempPath);

        // 生成新的文件名，含有包名和版本号
        const newName = `${packageName}@${packageInfo.version}_${file.name}`;
        // 拷贝到目标文件夹，使用新的文件名
        const finalPath = path.join(installPath, newName);
        await fs.copyFile(tempPath, finalPath);
    }
}

export async function uninstallSingleFile(installPath, packageName, version) {
    // 读取目标文件夹中的所有文件
    const files = await fs.readDir(installPath);

    // 遍历所有文件
    for (const file of files) {
        // 检查文件名是否含有包名和版本号
        if (file.name.startsWith(`${packageName}@${version}_`)) {
            // 删除文件
            const filePath = path.join(installPath, file.name);
            await fs.removeFile(filePath);
        }
    }
}