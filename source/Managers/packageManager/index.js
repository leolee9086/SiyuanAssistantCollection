import { sac } from "./runtime.js";
import { siyuanPackageDefines } from './packageType/siyuanPackageTypes/index.js'
import { thirdPartyPackageDefines } from "./packageType/thirdPartyPackages/index.js";
import { startCleanJob } from "./cache/clean.js";
import { DefinePackagetype as type } from "./packageType/packageDefine.js";
//开始清理缓存的定时任务
startCleanJob()
// 将路径替换操作抽取为单独的函数
export const usePackage = async (packageDefines) => {
    for (const packageDefine of packageDefines) {
        let packageHandler = type(packageDefine);
        await sac.statusMonitor.set('packages', packageDefine.topic, packageHandler);
    }
};
await usePackage(siyuanPackageDefines)
await usePackage(thirdPartyPackageDefines)
export const listPackageDefines = () => {
    let handlers = sac.statusMonitor.get('packages').$raw
    let data = {}
    Object.keys(handlers).forEach(
        topic => {
            data[topic] = handlers[topic].packageDefine
        }
    )
    return data
}
sac.eventBus.on(
    'registPackageType', (e) => {
        const { packageDefines, provider } = e.detail
        if (packageDefines && provider) {
            usePackage(packageDefines)
        }
    }
)