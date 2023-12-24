import { 下载基础模型 } from "./models.js";
import { 解压依赖 } from './dependencies.js'
import { fs,kernelApi,path } from "./runtime.js";
import { sac } from "./runtime.js";
export { 下载基础模型 as 下载基础模型 }
export { 解压依赖 as 解压依赖 }
import { getReposByTopic } from "./adapters/GitHub.js";
import { download } from "./downloader/downloader.js";
export const type=(packageDefine={})=>{
    return {
        async list(){
            return (await fs.readDir(packageDefine.location.replace('@sac',sac.selfPath))).filter(
                item=>{
                    if(packageDefine.allowSingle){
                        return true
                    } else{
                        return item.isDir
                    }
                }
            ).map(
                _package=>{
                    return _package.name
                }
            )
        },
        async file(packageName){
            return await fs.readDir(packageDefine.location.replace('@sac',sac.selfPath)+`/${packageName}`)
        },
        async getConfig(packageName){
            let dataPath= packageDefine.location.replace('@sac',sac.selfPath)+`/${packageName}/${packageDefine.config}`
            console.log(dataPath)
            return JSON.parse(await fs.readFile(packageDefine.location.replace('@sac',sac.selfPath)+`/${packageName}/${packageDefine.config}`))
        },
        async getMeta(packageName){
            let dataPath= packageDefine.location.replace('@sac',sac.selfPath)+`/${packageName}/${packageDefine.meta}`
            return JSON.parse(await fs.readFile(dataPath))
        },
        resolve(packageName,_path){
            let dir = packageDefine.location.replace('@sac',sac.selfPath)+`/${packageName}`
            return path.resolve(dir,_path)
        },
        async load(packageName,fileName){
            return await packageDefine.load(packageName,fileName)
        },
        async listFromGithub(){
            let repos = await getReposByTopic(packageDefine.topic)
            return repos.map(repo => {
                const baseUrl = `https://github.com/${repo.owner.login}/${repo.name}/raw/master`;
                return {
                    name: repo.name,
                    readmeUrl: `${baseUrl}/README.md`,
                    iconUrl: `${baseUrl}/icon.png`,
                    previewUrl: `${baseUrl}/preview.png`,
                    repoUrl:`https://github.com/${repo.owner.login}/${repo.name}`
                };
            });
        },
        async packageZip(packageName){
            let dataPath= packageDefine.location.replace('@sac',sac.selfPath)+`/${packageName}/`
            await fs.mkdir(`/temp/noobTemp/bazzarPackage/`)
            await kernelApi.zip(
                {
                    path:dataPath,
                    zipPath:`/temp/noobTemp/bazzarPackage/${packageName}.zip`
                }
            )
            let data= await fs.readFile(`/temp/noobTemp/bazzarPackage/${packageName}.zip`)
            return Buffer.from(data)
        },
        async install(packageInfo){
            let { packageSource, packageRepo, packageName } = packageInfo;
            if (packageSource === 'github') {
                let response = await fetch(`https://api.github.com/repos/${packageRepo.replace('https://github.com/','')}/releases/latest`);
                let data = await response.json();
                let zipAsset = data.assets.find(asset => asset.name === 'package.zip');
                if (zipAsset) {
                    let fileURL = zipAsset.browser_download_url;
                    // Now fileURL contains the URL of the package.zip file in the latest release
                    console.log(fileURL);
                    let dataPath= packageDefine.location.replace('@sac',sac.selfPath)+`/${packageName}/`
                    let tempPath= `/temp/noobTemp/bazzarPackage/${packageName}.zip`
                    await download(fileURL,tempPath)
                    await kernelApi.unzip(
                        {zipPath:tempPath,
                        path:dataPath}
                    )
                }
            }
        },
        async uninstall(packageName){
            let dataPath= packageDefine.location.replace('@sac',sac.selfPath)+`/${packageName}/`
            await fs.removeFile(dataPath)
        } 
    }
}