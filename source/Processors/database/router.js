import { sac } from "../../asyncModules.js";
import {数据库} from './localDataBase/index.js'
const 向量存储 = {
    公开向量数据库实例: new 数据库('/data/public/vectorStorage'),
    插件向量数据库实例: new 数据库('/data/storage/petal/SiyuanAssistantCollection/vectorStorage'),
    //临时向量数据库实例,可以用来存一些不需要的数据
    临时向量数据库实例: new 数据库('/temp/vectorStorage'),
    简易向量数据原型: 数据库
}
let openAI块数据集 = 向量存储.公开向量数据库实例.创建数据集(
    'blockVectors' + '/' + 'openAI',
    'id',
    'box'
)
await openAI块数据集.加载数据()
let Router = sac.路由管理器.Router
let databaseRouter=new Router()
databaseRouter.post(
    '/query',async(ctx,next)=>{
        let data = {
            vector:[],
            collection_name:'blocks',
            limit:10,
            filter:'',
            output_fields:'',
            ...ctx.req.body
        }
        if(openAI块数据集.数据加载完成){
            ctx.body.data=await openAI块数据集.以向量搜索数据('vector',data.vector)
        }else{
            ctx.body.data=[]
        }
    }
)
export {databaseRouter }