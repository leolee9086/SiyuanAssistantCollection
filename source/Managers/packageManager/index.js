import { 下载基础模型 } from "./models.js";
import { 解压依赖 } from './dependencies.js'
import { fs } from "./runtime.js";
import { sac } from "./runtime.js";
export { 下载基础模型 as 下载基础模型 }
export { 解压依赖 as 解压依赖 }

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
        }
    }
}