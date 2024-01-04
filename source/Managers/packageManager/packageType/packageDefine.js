import { getReposFromURL } from "../adapters/fileList.js";
import { fs, path } from "../runtime.js";
import { sac } from "../runtime.js";
import { getAdapters } from "../adapters/index.js";
import { genRemote } from "./remotePackages.js";
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


function preparePackageDefine(packageDefine = {}) {
    packageDefine.meta = packageDefine.meta || 'package.json';
    packageDefine.workspace = fs
    return packageDefine;
}
function genLocalPackageOperations(packageDefine) {
    return {
        metas:{},
        configs:{},
        status:{},
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
            packageDefine.local.configs[packageName]=await readJsonFile(path);
            return await packageDefine.local.configs[packageName]
        },
        async setConfig(packageName,data) {
            const path = replacePath(packageDefine.location, packageName) + packageDefine.config;
            await fs.writeFile(path,JSON.stringify(data))
            packageDefine.local.configs[packageName]=data
            return await packageDefine.local.configs[packageName]
        },
        async getMeta(packageName) {
            const path = replacePath(packageDefine.location, packageName) + packageDefine.meta;
            packageDefine.local.metas[packageName]=await readJsonFile(path);
            return packageDefine.local.metas[packageName]
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
function genInstaller(packageDefine) {
    return {
        async install(packageInfo) {
            const { name, url, source } = packageInfo;
            let adapter = (await getAdapters([source]))[0]
            let installPath = replacePath(packageDefine.location, name)
            if (packageDefine.installer) {
                await packageDefine.installer.install.bind(packageDefine)(packageInfo)
            } else if (!packageDefine.singleFile) {
                await adapter.installPackageZip(installPath, name, url, packageInfo)
            } else {
                if (adapter.installSingleFile) {
                    await adapter.installSingleFile(installPath, name, url, packageInfo)
                }
            }
        },
        async uninstall(packageInfo) {
            if (!packageDefine.singleFile) {
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


export const DefinePackagetype = (packageDefine = {}) => {
    // 判断 packageDefine 是否是一个类
    if (typeof packageDefine === 'function' ) {
        // 如果是，使用 new 创建一个新的实例
        // 将 local 等挂载到 packageDefine 上
        try{
        packageDefine = new packageDefine();
        console.log(packageDefine,packageDefine.__proto__)

        packageDefine.__proto__.addPackageSourceFromUrl = async (url, type) => {
            return await getReposFromURL(url, packageDefine.topic, type);
        };
        packageDefine.__proto__.remote = genRemote(packageDefine);
        packageDefine.__proto__.installer = genInstaller(packageDefine);
        packageDefine.__proto__.local = genLocalPackageOperations(packageDefine);
        }catch(e){
            throw  new Error("包类型定义错误",packageDefine,e)
        }
    }
    //补全默认的meta.json文件
    packageDefine = preparePackageDefine(packageDefine);
    console.log(packageDefine)
    return {
        packageDefine,
        async addPackageSourceFromUrl(url, type) {
            return await getReposFromURL(url, packageDefine.topic, type)
        },
        remote: genRemote(packageDefine),
        installer: genInstaller(packageDefine),
        local: genLocalPackageOperations(packageDefine)
    };
};
