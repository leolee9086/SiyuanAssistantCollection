import { 下载基础模型 } from "./models.js";
import { 解压依赖 } from './dependencies.js'
import { fs,kernelApi,path } from "./runtime.js";
import { sac } from "./runtime.js";
export { 下载基础模型 as 下载基础模型 }
export { 解压依赖 as 解压依赖 }
import {  getReposInfoByTopic } from "./adapters/GitHub.js";
import { download } from "./downloader/downloader.js";
// 将路径替换操作抽取为单独的函数
function replacePath(path, packageName) {
    let _path= path.replace('@sac', sac.selfPath) 
    return packageName ?_path+`/${packageName}/`:_path
}

// 将读取 JSON 文件的操作抽取为单独的函数
async function readJsonFile(path) {
    const data = await fs.readFile(path);
    return JSON.parse(data);
}

export const type = (packageDefine = {}) => {
    return {
        async list() {
            const dir = replacePath(packageDefine.location);
            const items = await fs.readDir(dir);
            return items.filter(item => packageDefine.allowSingle || item.isDir).map(_package => _package.name);
        },
        async getStatus() {
            // Implement getStatus method
        },
        async writeStatus(packageName,status) {
            // Implement writeStatus method
            //首先读取包类型安装目录下的json文件,这个json文件与包类型同名,例如包类型如果是plugin.那么配置文件就是plugins.json
            //然后找到包名对应的项目,将status写入,并写回文件
        },
        async file(packageName) {
            const dir = replacePath(packageDefine.location, packageName);
            return await fs.readDir(dir);
        },
        async getConfig(packageName) {
            const path = replacePath(packageDefine.location, packageName) + packageDefine.config;
            return readJsonFile(path);
        },
        async getMeta(packageName) {
            const path = replacePath(packageDefine.location, packageName) + packageDefine.meta;
            return readJsonFile(path);
        },
        resolve(packageName, _path) {
            const dir = replacePath(packageDefine.location, packageName);
            return path.resolve(dir, _path);
        },
        async load(packageName, fileName) {
            return await packageDefine.load(packageName, fileName);
        },
        async listFromGithub() {
            return await getReposInfoByTopic(packageDefine.topic)
        },
        async packageZip(packageName) {
            const dataPath = replacePath(packageDefine.location, packageName);
            await fs.mkdir(`/temp/noobTemp/bazzarPackage/`);
            await kernelApi.zip({
                path: dataPath,
                zipPath: `/temp/noobTemp/bazzarPackage/${packageName}.zip`
            });
            const data = await fs.readFile(`/temp/noobTemp/bazzarPackage/${packageName}.zip`);
            return Buffer.from(data);
        },
        async install(packageInfo) {
            const { packageSource, packageRepo, packageName } = packageInfo;
            if (packageSource === 'github') {
                const response = await fetch(`https://api.github.com/repos/${packageRepo.replace('https://github.com/', '')}/releases/latest`);
                const data = await response.json();
                const zipAsset = data.assets.find(asset => asset.name === 'package.zip');
                if (zipAsset) {
                    const fileURL = zipAsset.browser_download_url;
                    const dataPath = replacePath(packageDefine.location, packageName);
                    const tempPath = `/temp/noobTemp/bazzarPackage/${packageName}.zip`;
                    await download(fileURL, tempPath);
                    await kernelApi.unzip({
                        zipPath: tempPath,
                        path: dataPath
                    });
                }
            }
        },
        async uninstall(packageName) {
            const dataPath = replacePath(packageDefine.location, packageName);
            await fs.removeFile(dataPath);
        }
    };
};