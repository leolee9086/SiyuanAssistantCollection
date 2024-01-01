import { getReposInfoByTopic, installPackageZip } from "../adapters/GitHub.js";
import { installPackageZip as installPackageZipNpm, installSingleFile as installSingleFileNpm } from "../adapters/NPM.js";
import { getPackageInfoByKeyword } from "../adapters/NPM.js";
import { getReposFromURL } from "../adapters/fileList.js";
import { fs, kernelApi, path } from "../runtime.js";
import { sac } from "../runtime.js";
import { readFromCache } from "../cache/reader.js";

function replacePath(path, packageName) {
    let _path = path.replace('@sac', sac.selfPath)
    return packageName ? _path + `/${packageName}/` : _path
}
// 将读取 JSON 文件的操作抽取为单独的函数
async function readJsonFile(path) {
    if (await fs.exists(path)) {
        const data = await fs.readFile(path);
        if (data) {
            return JSON.parse(data);
        } else {
            return {}
        }
    } else return {}
}
let remotePackageRegistryAdapters={
    npm:{
        getReposInfoByTopic:getPackageInfoByKeyword,
        installPackageZip:installPackageZipNpm,
        installSingleFile:installSingleFileNpm
    },
    github:{
        getReposInfoByTopic:getReposInfoByTopic,
        installPackageZip:installPackageZip
    }
}
async function getAdapters(adapterNames) {
    let selectedAdapters = [];
    for (let name of adapterNames) {
        if (name in remotePackageRegistryAdapters) {
            selectedAdapters.push(remotePackageRegistryAdapters[name])
        } else {
            console.warn(`Adapter ${name} not found.`);
        }
    }
    return selectedAdapters;
}
async function fetchFromRemote(packageDefine,remotePackageRegistryAdapters) {
    let repos = [];
    for (let adapter in remotePackageRegistryAdapters) {
        try {
            const packages = await remotePackageRegistryAdapters[adapter].getReposInfoByTopic(packageDefine.topic, packageDefine.meta);
            repos = [...repos, ...packages];
        } catch (error) {
            console.error(`Failed to fetch packages from ${adapter}: `, error);
        }
    }
    if (packageDefine.listRemote) {
        try {
            let data = { repos };
            let result = await packageDefine.listRemote(data);
            repos = result.repos;
        } catch (error) {
            console.error("Failed to list remote packages: ", error);
        }
    }
    return repos;
}
export const DefinePackagetype = (packageDefine = {}) => {
    //补全默认的meta.json文件
    packageDefine.meta = packageDefine.meta || 'package.json'
    return {
        packageDefine,
        async list() {
            const dir = replacePath(packageDefine.location);
            const items = await fs.readDir(dir);
            if (items && items[0]) {
                return items.filter(item => packageDefine.allowSingle || item.isDir).map(_package => _package.name);
            } else {
                return []
            }
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

        async addPackageSourceFromUrl(url, type) {
            return await getReposFromURL(url, packageDefine.topic, type)
        },
        async listFromAllRemoteSource() {
            const cacheFilePath = `/temp/noobCache/bazzar/${packageDefine.topic}/cache.json`;
            let adapterNames = packageDefine.adapters
            let PackageRegistryRemoteAdapters = await getAdapters(adapterNames)
            let repos=[]// = await readFromCache(cacheFilePath)
            if (!repos[0]) {
                repos= await fetchFromRemote(packageDefine,PackageRegistryRemoteAdapters)
                await fs.writeFile(cacheFilePath, JSON.stringify({ repos }));
            }
            return repos;

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
            const { name, url, source } = packageInfo;
            let adapter= (await getAdapters([source]))[0]
            let installPath = replacePath(packageDefine.location, name)
            if (packageDefine.installer) {
                await packageDefine.installer.install(packageInfo)
            } else if (!packageDefine.singleFile) {
                await adapter.installPackageZip(installPath, name, url, packageInfo)
            } else {
                if(adapter.installSingleFile){
                    await adapter.installSingleFile(installPath, name, url, packageInfo)
                }
            }
        },
        async uninstall(packageInfo) {
            if(!packageDefine.singleFile){
                const { packageSource, packageRepo, packageName } = packageInfo;
                const installPath = replacePath(packageDefine.location, packageName);
                await fs.removeFile(installPath);    
            }
        }
    };
};
