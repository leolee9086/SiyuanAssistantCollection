import  {kernelApi}  from "./runtime.js"
import {path} from './runtime.js'

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