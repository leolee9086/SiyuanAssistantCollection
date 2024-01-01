import { got } from '../runtime.js';
import { convertTgzToZip } from '../../../utils/Archive/tgz.js'
import { fs,path, kernelApi } from '../runtime.js';
import { getFastestEndpoint } from '../../../utils/network/fastest.js';
const registries = ['https://registry.npmjs.org', 'https://registry.npmmirror.com'];
const getFastestRegistry=async()=>{return await getFastestEndpoint(registries)}
// 获取包的最新版本信息
async function 获取最新版本信息(包名) {
    const registry = await getFastestRegistry()

    let url = `${registry}/${包名}/latest`;
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`获取最新版本信息失败: ${response.statusText}`);
    }
    return await response.json();
}

// 获取包的下载URL
function 获取包下载链接(版本信息) {
    return 版本信息.dist.tarball;
}
// 下载包
async function 下载包(url, 包名) {
    let response = await fetch(url);
    if (!response.ok) {
        throw new Error(`下载包失败: ${response.statusText}`);
    }
    let blob = await response.blob();
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${包名}.tgz`;
    link.click();
}
//搜索符合条件的包
export async function getPackagesByKeyword(keyword) {
    const registry = await getFastestRegistry()

    const url = `${registry}/-/v1/search?text=${keyword}`;
    const response = await got(url);
    return JSON.parse(response.body).objects;
}
// NPM adapter
export async function getPackageInfoByKeyword(keyword) {
    const packages = await getPackagesByKeyword(keyword);
    return packages.map(pkg => {
        let repoUrl = pkg.package.links && pkg.package.links.repository;
        let baseUrl = '';
        if (repoUrl) {
            baseUrl = repoUrl.replace('github.com', 'raw.githubusercontent.com').replace(/(\/tree|\/blob)/, '') + '/master';
        }
        return {
            url: pkg.package.links && pkg.package.links.npm,
            updated: null, // This information is not available from the package data
            stars: null, // This information is not available from the package data
            openIssues: null, // This information is not available from the package data
            size: null, // This information is not available from the package data
            topic:keyword,

            package: {
                name: pkg.package.name,
                author: null, // This information is not available from the package data
                url: pkg.package.links && pkg.package.links.npm,
                version: pkg.package.version,
                minAppVersion: null, // This information is not available from the package data
                backends: null, // This information is not available from the package data
                frontends: null, // This information is not available from the package data
                displayName: {
                    default: pkg.package.name,
                    zh_CN: null, // This information is not available from the package data
                    en_US: null // This information is not available from the package data
                },
                description: {
                    default: pkg.package.description,
                    zh_CN: null, // This information is not available from the package data
                    en_US: null // This information is not available from the package data
                },
                readme: {
                    default: repoUrl ? `${baseUrl}/README.md` : null,
                    zh_CN: null, // This information is not available from the package data
                    en_US: null // This information is not available from the package data
                },
                funding: {
                    openCollective: null, // This information is not available from the package data
                    patreon: null, // This information is not available from the package data
                    github: null, // This information is not available from the package data
                    custom: null // This information is not available from the package data
                },
                keywords: pkg.package.keywords || null,
                source:"npm",
                topic:keyword,

            }
        };
    });
}

// 主函数
export async function 下载最新版本包(包名) {
    let 版本信息 = await 获取最新版本信息(包名);
    let 包下载链接 = 获取包下载链接(版本信息);
    await 下载包(包下载链接, 包名);
}
export async function installPackageZip(installPath, packageName) {
    let 版本信息 = await 获取最新版本信息(packageName);
    let 包下载链接 = 获取包下载链接(版本信息);
    let string2 = (await got(包下载链接, {
        responseEncoding: "base64"
    })).body
    let binaryData2 = Buffer.from(string2, 'base64');
    const tempPath = `/temp/noobTemp/bazzarPackage/${packageName}@${版本信息.version}.zip`;
    await fs.writeFile(tempPath, await convertTgzToZip(binaryData2));
    await kernelApi.unzip({
        zipPath: tempPath,
        path: installPath
    });
    const files = await fs.readDir(installPath);
    // 如果只有一个文件夹，且文件夹名为 "package" 或与外部文件夹同名
    if (files.length === 1 && (files[0].name === 'package' || files[0].name === packageName)) {
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
        packageVersionInfo:版本信息,
        success:true
    }
}
export async function installSingleFile(installPath, packageName) {
    // 创建临时文件夹路径
    const tempPath = `/temp/noobTemp/bazzarPackage/${packageName}`;
    // 使用 installPackageZip 安装文件到临时文件夹
    let info =await installPackageZip(tempPath, packageName);
    // 获取版本信息
    let 版本信息 = info.packageVersionInfo
    // 读取临时文件夹中的所有文件
    const files = await fs.readDir(tempPath);
    // 遍历所有文件
    for (const file of files) {
        // 生成新的文件名，含有包名和版本号
        const oldPath = path.join(tempPath, file.name);
        const newName = `${packageName}@${版本信息.version}_${file.name}`;
        // 拷贝到目标文件夹，使用新的文件名
        const finalPath = path.join(installPath, newName);
        await fs.copyFile(oldPath, finalPath);
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