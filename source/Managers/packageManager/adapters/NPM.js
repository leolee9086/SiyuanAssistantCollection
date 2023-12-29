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


export async function getPackagesByKeyword(keyword) {
    const registry = await getFastestRegistry()

    const url = `${registry}/-/v1/search?text=${keyword}`;
    const response = await got(url);
    return JSON.parse(response.body).objects;
}


// NPM adapter
export async function getPackageInfoByKeyword(keyword) {
    const registry = await getFastestRegistry()

    const packages = await getPackagesByKeyword(keyword);
    return packages.map(pkg => {
        console.log(pkg)
        let repoUrl = pkg.package.links && pkg.package.links.repository;
        let baseUrl = '';
        if (repoUrl) {
            baseUrl = repoUrl.replace('github.com', 'raw.githubusercontent.com').replace(/(\/tree|\/blob)/, '') + '/master';
        }
        return {
            name: pkg.package.name,
            version: pkg.package.version,
            description: pkg.package.description,
            homepage: pkg.package.links && pkg.package.links.homepage,
            npmUrl: (pkg.package.links && pkg.package.links.npm) || `${registry.replace('registry', 'www')}/${pkg.package.name}`,
            repositoryUrl: repoUrl,
            readmeUrl: repoUrl ? `${baseUrl}/README.md` : null,
            iconUrl: repoUrl ? `${baseUrl}/icon.png` : null,
            previewUrl: repoUrl ? `${baseUrl}/preview.png` : null,
            source: "npm"
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
    let 包下载链接 = `https://cdn.npmmirror.com/packages/afdian-rss/0.0.1/afdian-rss-0.0.1.tgz`
    //获取包下载链接(版本信息);
    let string2 = (await got(包下载链接, {
        responseEncoding: "base64"
    })).body
    let binaryData2 = Buffer.from(string2, 'base64');
    const tempPath = `/temp/noobTemp/bazzarPackage/${packageName}.zip`;
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
}