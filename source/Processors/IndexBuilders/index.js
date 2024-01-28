import { sac } from "../../asyncModules.js";
import { 开始清理块索引 } from "./utils/cleaner.js";
let { internalFetch } = sac.路由管理器
let 初始化块数据集 = async () => {
    let collectionsRes = await internalFetch('/database/collections/build', {
        method: 'POST',
        body: {
            collection_name: 'blocks',
            main_key: 'id',
            file_path_key: 'box',
        }
    })
    return collectionsRes
}
初始化块数据集().then(
    res=>{
        sac.logger.log(res)
        开始清理块索引()
    }
)
