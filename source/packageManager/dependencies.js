import  kernelApi  from "../polyfills/kernelApi.js"
import path from '../polyfills/path.js'
let workspaceDir = globalThis.siyuan.config.system.workspaceDir
let depsPath = import.meta.resolve('../../static.zip').split('plugins')[1]
depsPath=path.join('data','plugins',depsPath)
export const 解压依赖 = async()=>{
    await kernelApi.unzip(
        {
            zipPath:depsPath,
            path:depsPath.replace('.zip','')
        }
    )
}