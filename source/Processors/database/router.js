import { sac } from "../../asyncModules.js";
import { 数据库 } from './localDataBase/index.js'
const 向量存储 = {
    公开向量数据库实例: new 数据库('/data/public/vectorStorage'),
    插件向量数据库实例: new 数据库('/data/storage/petal/SiyuanAssistantCollection/vectorStorage'),
    //临时向量数据库实例,可以用来存一些不需要的数据
    临时向量数据库实例: new 数据库('/temp/vectorStorage'),
    简易向量数据原型: 数据库
}
let Router = sac.路由管理器.Router
let databaseRouter = new Router()
databaseRouter.post(
    '/collections/build', async (ctx, next) => {
        try {
            let data = {
                dataBase: 'public',
                collection_name: '',
                main_key: 'id',
                file_path_key: 'box',
                ...ctx.req.body
            }
            let 数据集 = 向量存储.公开向量数据库实例.创建数据集(
                data.collection_name, data.main_key, data.file_path_key
            )
            await 数据集.加载数据()
            ctx.body = {
                msg: 0,
                data: {
                    succeed: true
                }
            }
        } catch (e) {
            ctx.body = {
                msg: 1,
                error: error
            }
        }
    }
)
databaseRouter.post(
    '/query', async (ctx, next) => {
        let data = {
            vector: [],
            collection_name: '',
            limit: 10,
            filter: '',
            output_fields: '',
            ...ctx.req.body
        }
        let 本地块数据集 = 向量存储.公开向量数据库实例.根据名称获取数据集(data.collection_name)
        if (!本地块数据集) {
            ctx.body.data = {
                mag: 1,
                error: `数据集${data.collection_name}不存在`
            }
        } else if (!本地块数据集.数据加载完成) {
            ctx.body.data = {
                mag: 1,
                error: `数据集${data.collection_name}数据加载未完成`
            }
        }
        else {
            try {
                ctx.body.data = await 本地块数据集.以向量搜索数据('vector', data.vector)
            }
            catch (e) {
                ctx.body.data = {
                    mag: 1,
                    error: "查询中发现出现未知错误,请检查日志" + e
                }
            }
        }
    }
)
export { databaseRouter }