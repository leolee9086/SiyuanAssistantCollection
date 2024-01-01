import { getReposInfoByTopic, installPackageZip } from "../adapters/GitHub.js";
import { installPackageZip as installPackageZipNpm, installSingleFile as installSingleFileNpm } from "../adapters/NPM.js";
import { getPackageInfoByKeyword } from "../adapters/NPM.js";
import { getReposFromURL } from "../adapters/fileList.js";
import { fs,  path } from "../runtime.js";
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
function preparePackageDefine(packageDefine = {}) {
    packageDefine.meta = packageDefine.meta || 'package.json';
    return packageDefine;
}
function genLocalPackageOperations(packageDefine) {
    return {
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
        }
    };
}
function genInstaller(packageDefine){
    return{
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
        },
        async checkInstall(packageInfo) {
            const { packageSource, packageRepo, packageName } = packageInfo;
            const dataPath = replacePath(packageDefine.location, packageName);
            let exists = await fs.exists(dataPath)
            return exists ? true : false
        },
    }
}
function genRemote(packageDefine){
    return {
        async listFromAllRemoteSource() {
            const cacheFilePath = `/temp/noobCache/bazzar/${packageDefine.topic}/cache.json`;
            let adapterNames = packageDefine.adapters
            let PackageRegistryRemoteAdapters = await getAdapters(adapterNames)
            let repos
            repos = await readFromCache(cacheFilePath)
            if (!repos) {
                repos= await fetchFromRemote(packageDefine,PackageRegistryRemoteAdapters)
                await fs.writeFile(cacheFilePath, JSON.stringify({ repos }));
            }
            return repos;
        },
    }
}

export const DefinePackagetype = (packageDefine = {}) => {
    //补全默认的meta.json文件
    packageDefine = preparePackageDefine(packageDefine);
    return {
        packageDefine,
        async addPackageSourceFromUrl(url, type) {
            return await getReposFromURL(url, packageDefine.topic, type)
        },
        remote:genRemote(packageDefine),
        installer:genInstaller(packageDefine),
        local:genLocalPackageOperations(packageDefine)
    };
};
