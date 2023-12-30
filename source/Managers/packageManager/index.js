import { 下载基础模型 } from "./models.js";
import { 解压依赖 } from './dependencies.js'
import { fs, kernelApi, path } from "./runtime.js";
import { sac } from "./runtime.js";
export { 下载基础模型 as 下载基础模型 }
export { 解压依赖 as 解压依赖 }
import { getReposInfoByTopic, installPackageZip } from "./adapters/GitHub.js";
import { installPackageZip as installPackageZipNpm } from "./adapters/NPM.js";
import { getPackageInfoByKeyword } from "./adapters/NPM.js";
import { getReposFromURL } from "./adapters/fileList.js";
// 将路径替换操作抽取为单独的函数
function replacePath(path, packageName) {
    let _path = path.replace('@sac', sac.selfPath)
    return packageName ? _path + `/${packageName}/` : _path
}
// 将读取 JSON 文件的操作抽取为单独的函数
async function readJsonFile(path) {
    const data = await fs.readFile(path);
    return JSON.parse(data);
}
export const type = (packageDefine = {}) => {
    return {
        packageDefine,
        async list() {
            const dir = replacePath(packageDefine.location);
            const items = await fs.readDir(dir);
            return items.filter(item => packageDefine.allowSingle || item.isDir).map(_package => _package.name);
        },
        async getStatus() {
            // Implement getStatus method
        },
        async writeStatus(packageName, status) {
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
        async listFromNpm() {
            return await getPackageInfoByKeyword(packageDefine.topic)
        },
        async addPackageSourceFromUrl(url, type) {
            return await getReposFromURL(url, packageDefine.topic, type)
        },
        async listFromAllRemoteSource() {
            const githubPackages = await this.listFromGithub();
            const npmPackages = await this.listFromNpm();
            return [...githubPackages, ...npmPackages];
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
        async checkInstall(packageInfo) {
            const { packageSource, packageRepo, packageName } = packageInfo;
            const dataPath = replacePath(packageDefine.location, packageName);
            let exists = await fs.exists(dataPath)
            return exists ? true : false
        },
        async install(packageInfo) {
            const { packageSource, packageRepo, packageName } = packageInfo;
            let installPath = replacePath(packageDefine.location, packageName)
            if (packageSource === 'github') {
                await installPackageZip(installPath, packageName, packageRepo)
            }
            if (packageSource === 'npm') {
                await installPackageZipNpm(installPath, packageName, packageRepo)
            }
        },
        async uninstall(packageInfo) {
            const { packageSource, packageRepo, packageName } = packageInfo;

            const installPath = replacePath(packageDefine.location, packageName);
            await fs.removeFile(installPath);
        }
    };
};
export const usePackage = async (packageDefines) => {
    for ( const packageDefine of packageDefines) {
        let packageHandler = type(packageDefine);
        await sac.statusMonitor.set('packages', packageDefine.name, packageHandler);
    }
};
export const listPackageDefines=async()=>{
    return await sac.statusMonitor.get('packages').$raw
}