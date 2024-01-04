import { readFromCache } from "../cache/reader.js";
import { fs } from "../runtime.js";
import { getAdapters } from "../adapters/index.js";
export function genRemote(packageDefine){
    return {
        async listFromAllRemoteSource() {
            console.log(packageDefine)
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
async function fetchFromRemote(packageDefine,remotePackageRegistryAdapters) {
    let repos = [];
    for (let adapter in remotePackageRegistryAdapters) {
        try {
            const packages = await remotePackageRegistryAdapters[adapter].getReposInfoByTopic(packageDefine.topic, packageDefine.meta);
            repos = [...repos, ...packages];
        } catch (error) {
            console.error(`Failed to fetch packages from ${remotePackageRegistryAdapters[adapter]}: `, error);
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