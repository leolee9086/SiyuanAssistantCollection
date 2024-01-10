import { sac } from "../../../asyncModules.js"
let {internalFetch} = sac.路由管理器
export const 创建公共数据集 =async(collection_name,main_key="id",file_path_key="box")=>{
    let data = {
        body:{
            collection_name,
            main_key,
            file_path_key
        },
        method:"POST"
    }
    return await internalFetch('/database/collections/build',data)
}
