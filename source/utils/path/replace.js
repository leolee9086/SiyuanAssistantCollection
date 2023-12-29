import { Constants } from "../../asyncModules.js"
export const replacePathConstants=(path)=>{
    let pathConstants=Constants.path
    return 根据路径表替换开头(path,pathConstants)
}
const 根据路径表替换开头 = (路径,别名表)=>{
    let 替换结果=路径||''
    Object.keys(别名表).forEach(
        别名=>{
            if(替换结果.startsWith(别名)){
                 替换结果= path.replace(别名,别名表[别名])  
              }
        }
    )
    return 替换结果
}