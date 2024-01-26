import { sac } from "../../asyncModules.js";
import { 数据库 } from './localDataBase/index.js'
import { 从测试版迁移数据 } from "./localDataBase/utils/migration.js";
await 从测试版迁移数据()
const 向量存储 = {
    公开向量数据库实例: new 数据库('/data/public/vectorStorage'),
    插件向量数据库实例: new 数据库('/data/storage/petal/SiyuanAssistantCollection/vectorStorage'),
    //临时向量数据库实例,可以用来存一些不需要的数据
    临时向量数据库实例: new 数据库('/temp/vectorStorage'),
    简易向量数据原型: 数据库
}
let Router = sac.路由管理器.Router
let databaseRouter = new Router()
let 已初始化数据集 = []
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
                data.collection_name, data.file_path_key
            )
            if(!数据集.数据加载完成){
                await 数据集.加载数据()
            }
            if (!数据集.数据加载中 && 已初始化数据集.indexOf(数据集) === -1) {
                已初始化数据集.push(数据集)
                await 数据集.加载数据()
            }
            ctx.body = {
                msg: 0,
                data: {
                    succeed: true,
                    collection_name: data.collection_name
                }
            }
        } catch (e) {
            console.error(ctx)
            ctx.error(e.message)
        }
        next()

    }
)
databaseRouter.post(
    '/export/json', async (ctx, next) => {
        try {
            let data = {
                dataBase: 'public',
                collection_name: '',
                main_key: 'id',
                file_path_key: 'box',
                ...ctx.req.body
            }

            let 数据集 = 向量存储.公开向量数据库实例.创建数据集(
                data.collection_name, data.file_path_key
            )
            if (!数据集.数据加载中) {
                await 数据集.加载数据()
            }
            ctx.body = {
                msg: 0,
                data: 数据集.数据集对象
            }
        } catch (e) {
            ctx.error(e.message)
        }

    }
)
databaseRouter.post(
    '/query', async (ctx, next) => {
        let data = {
            vector: [],
            collection_name: '',
            limit: 10,
            filter_before: '',
            filter_after:"",
            output_fields: '',
            ...ctx.req.body
        }
        let 本地块数据集 = 向量存储.公开向量数据库实例.根据名称获取数据集(data.collection_name)
        if (!本地块数据集) {
            ctx.error(`数据集${data.collection_name}不存在`)
        } else if (本地块数据集.数据加载中) {
            sac.logger.databasewarn(`数据集${data.collection_name}数据加载未完成`)
        }
        if (本地块数据集) {

            try {
                let result = await 本地块数据集.以向量搜索数据(data.vector_name,data.vector,data.limit,data.filter_before,data.filter_after)
                ctx.body.data = result
            }
            catch (e) {
                ctx.error("查询中发现出现错误,请检查日志" + e)
            }
        }
    }
)
databaseRouter.post(
    '/keys', async (ctx, next) => {
        let data = {
            collection_name: '',
            with_meta: true,
            ...ctx.req.body
        }
        let 本地块数据集 = await 向量存储.公开向量数据库实例.根据名称获取数据集(data.collection_name)
        if (!本地块数据集) {
            ctx.error(`数据集${data.collection_name}不存在`)
        } else if (本地块数据集.数据加载中) {
            console.warn(`数据集${data.collection_name}数据加载未完成,但已经可以使用`)
        }
        if (本地块数据集) {
            try {
                if (data.with_meta) {
                    ctx.body.data = 本地块数据集.主键列表.map(
                        item => {
                            return {
                                id: item,
                                meta: 本地块数据集.数据集对象[item].meta
                            }
                        }
                    )
                    ctx.body.msg = 0
                } else {
                    ctx.body.data = 本地块数据集.主键列表
                    ctx.body.msg = 0

                }
            }
            catch (e) {
                ctx.error('查询中出现未知错误,请检查日志' + e.meesage)
            }
        }

    }
)
databaseRouter.post(
    '/delete', async (ctx, next) => {
        let data = {
            collection_name: '',
            keys: [],
            ...ctx.req.body
        }
        let 本地块数据集 = 向量存储.公开向量数据库实例.根据名称获取数据集(data.collection_name)
        if (!本地块数据集) {
            ctx.error(`数据集${data.collection_name}不存在`)

        } else if (本地块数据集.数据加载中) {
            console.warn(`数据集${data.collection_name}数据加载未完成`)
        }
        if (本地块数据集&&!本地块数据集.数据加载中) {
            try {
                await 本地块数据集.删除数据(data.keys)
                await 本地块数据集.保存数据()
            }
            catch (e) {
                ctx.error("删除数据时发生错误,请检查日志" + e)

            }
        }
    }
)
databaseRouter.post(
    '/state', async (ctx, next) => {
        let data = {
            collection_name: '',
            keys: [],
            ...ctx.req.body
        }
        let 本地块数据集 = 向量存储.公开向量数据库实例.根据名称获取数据集(data.collection_name)
        if (!本地块数据集) {
            ctx.error(`数据集${data.collection_name}不存在`)

        } else {
            ctx.body= {
                dataLoaded:本地块数据集.数据加载完成
            }
        }
    }
)
databaseRouter.post(
    '/add', async (ctx, next) => {
        console.log(ctx)
        let data = {
            collection_name: '',
            keys: [],
            ...ctx.req.body
        }
        let 本地块数据集 = 向量存储.公开向量数据库实例.根据名称获取数据集(data.collection_name)
        if (!本地块数据集) {
            ctx.error(`数据集${data.collection_name}不存在`)

        } else if (本地块数据集.数据加载中) {
            console.warn(`数据集${data.collection_name}数据加载未完成`)

        }
        if (本地块数据集) {
            try {
                await 本地块数据集.添加数据(data.vectors)
                await 本地块数据集.保存数据()
                ctx.body={
                    msg:0,
                    succeed:true
                }
            }
            catch (e) {
                ctx.error("添加数据时发生错误,请检查日志" + e)
            }
        }
    }
)
export { databaseRouter }