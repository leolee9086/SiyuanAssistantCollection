import { sac } from "../../../asyncModules.js"
let { internalFetch } = sac.路由管理器
export const 创建公共数据集 = async (collection_name, main_key = "id", file_path_key = "box") => {
    let data = {
        body: {
            collection_name,
            main_key,
            file_path_key
        },
        method: "POST"
    }
    return await internalFetch('/database/collections/build', data)
}
export const 获取数据集状态 = async (数据集名称) => {
    let 数据集状态 = await internalFetch('/database/state', {
        method: 'POST',
        body: {
            collection_name: 数据集名称
        }
    })
    return 数据集状态;
}
export const 获取数据集所有主键 = async (数据集名称) => {
    let 主键数组 = await internalFetch('/database/keys', {
        method: 'POST',
        body: {
            collection_name: 数据集名称
        }
    })
    return 主键数组;
}
export const 删除主键值 = async (数据集名称, 主键数组) => {
    return await internalFetch('/database/delete', {
        method: "POST", body: {
            collection_name: 数据集名称,
            keys: 主键数组
        }
    })
}
export const 添加数据 = async(数据集名称,数据组)=>{
    return await internalFetch('/database/add',{
        method:"POST",
        body:{
            collection_name:数据集名称,
            vectors:Array.isArray(数据组)?数据组:[数据组]
        }
    })
}
export const 标量查询数据集 = async(数据集名称, 标量查询条件, 带向量字段 = false)=>{
    return await internalFetch('/database/scalarQuery',{
        method:"POST",
        body:{
            collection_name: 数据集名称,
            query_conditions: 标量查询条件,
            include_vector_field: 带向量字段
        }
    })
}