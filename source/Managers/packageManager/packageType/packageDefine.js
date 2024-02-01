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
            console.log(packageDefine)
            const dir = replacePath(packageDefine.location);
            const items = await fs.readDir(dir);
            if (items && items[0]) {
                return items.filter(item => packageDefine.allowSingle || item.isDir).map(_package => _package.name);
            } else {
                return []
            }
        },
        //status包含了包类型中所有包的状态
        async getAllStatus() {
            let statusFile =path.join(replacePath(packageDefine.location),packageDefine.status||"status.json")
            if(await fs.exists(statusFile)){
                return JSON.parse(statusFile)
            }else{
                return {}
            }
            // Implement getStatus method
        },
        async getStatus(packageName){
            let allStatus = this.getAllStatus()
            return allStatus[packageName]
        },
        async initStatus(packageName){
            let status = await this.getAllStatus()
            if(status[packageName]){
                return status[packageName]
            }
            let meta = await this.getMeta(packageName)
            if(packageDefine.initStatus){
                let data =  await packageDefine.initStatus(meta,packageName)
                this.status[packageName]=data
                await fs.writeFile(statusFile,JSON.stringify(this.status))
                return this.status[packageName]
            }else{
                this.status[packageName]=JSON.parse(JSON.stringify(meta))
                await fs.writeFile(statusFile,JSON.stringify(this.status))
                return this.status[packageName]
            }
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
        packageDefine = new packageDefine();
    }
    let addPackageSourceFromUrl =async (url, type) => {
        return await getReposFromURL(url, packageDefine.topic, type);
    };
    let remote = genRemote(packageDefine)
    let installer =genInstaller(packageDefine)
    let local =genLocalPackageOperations(packageDefine)
    if (typeof packageDefine === 'function' ) {
        // 如果是，使用 new 创建一个新的实例
        // 将 local 等挂载到 packageDefine 上
        try{
        console.log(packageDefine,packageDefine.__proto__)
        packageDefine.__proto__.addPackageSourceFromUrl = addPackageSourceFromUrl
        packageDefine.__proto__.remote = remote;
        packageDefine.__proto__.installer = installer;
        packageDefine.__proto__.local = local;
        }catch(e){
            throw  new Error("包类型定义错误",packageDefine,e)
        }
    }else{
        packageDefine.addPackageSourceFromUrl=addPackageSourceFromUrl
        packageDefine.remote=remote
        packageDefine.installer=installer
        packageDefine.local=local
    }
    //补全默认的meta.json文件
    packageDefine = preparePackageDefine(packageDefine);
    return {
        packageDefine,
        addPackageSourceFromUrl,
        remote,
        installer,
        local
    };
};
