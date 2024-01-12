import fs from "../../../polyfills/fs.js";
import { text2vec } from "../../AIProcessors/publicUtils/endpoints.js";
import { 创建公共数据集 } from "../../database/publicUtils/endpoints.js";
import { sac } from "../runtime.js";
let 创建rss数据集 = async()=>{
    let rssDataCollectionRes = await 创建公共数据集('sac-rss-adapter')
    return rssDataCollectionRes
}
let 本地rss数据集已经启用 =false
export async function readFromCache(cachePath, remote) {
    try{
        let res = await 创建rss数据集()
        if(res.body.data.succeed){
            本地rss数据集已经启用=true
        }
    }catch(e){
        console.warn(e)
    }
    if(本地rss数据集已经启用){
        let res1=await sac.路由管理器.internalFetch(
            '/database/query',{
                method:"POST",
                body:{
                    vector:[
                    ],
                    collection_name:"sac-rss-adapter",
                    filter_before:{"meta.cachePath":`${cachePath}`},
                    limit:100
                }
            }
        )
        sac.logger.rsslog(`rss向量缓存可用,找到条目${cachePath}的查询结果`)
        if(res1.body.data&&res1.body.data[0]){
            return res1.body.data[0].meta
        } 
    }
    if (await fs.exists(cachePath) && !remote) {
        try {
            const data = await fs.readFile(cachePath);
            console.error(data,JSON.parse(data))
            return JSON.parse(data);
        } catch (e) {
            console.warn('缓存读取错误', e, cachePath);
        }
    }
    return null;
}
export async function writeToCache(cachePath,feedJson){
    await fs.writeFile(cachePath, JSON.stringify(feedJson));
    let vec = await text2vec(feedJson.description)
    if(本地rss数据集已经启用){
        await  sac.路由管理器.internalFetch(
            '/database/add',{
                method:"POST",
                body:{
                    vectors:[{
                        vector:{
                            'leolee9086/text2vec-base-chinese':vec.body.data[0].embedding
                        },
                        id:Lute.NewNodeID(),
                        meta:{
                            cachePath,
                            ...feedJson
                        }
                    }],
                    collection_name:"sac-rss-adapter",
                }
            }
        ).then(
            res=>{
                if(res.body.succeed){
                    sac.logger.rsslog(`
成功添加一条rss数据
                    
                    `)
                }
            }
        ).then(
            res=>{
                feedJson.item.forEach(
                   async (item)=>{
                        let vec = await text2vec(item.description)
                        await sac.路由管理器.internalFetch(
                            '/database/add',{
                                method:"POST",
                                body:{
                                    vectors:[{
                                        vector:{
                                            'leolee9086/text2vec-base-chinese':vec.body.data[0].embedding
                                        },
                                        id:Lute.NewNodeID(),
                                        meta:{
                                            cachePath,
                                            ...item
                                        }
                                    }],
                                    collection_name:"sac-rss-adapter",
                                }
                            }
                        )
                    }
                )
            }
        )
    }
}

export const handleFeedQueryVector=async(ctx,next)=>{
    let {query}=ctx.req.body
    let vec = await text2vec(query)
    if(!本地rss数据集已经启用){
        ctx.body={
            msg:1,
            data:null
        }
    }else{
        let res = await sac.路由管理器.internalFetch('/database/query',
            {
                method:"POST",
                body:{
                    collection_name:"sac-rss-adapter",
                    vector:vec.body.data[0].embedding,
                    vector_name:'leolee9086/text2vec-base-chinese',
                }
            }
        )
        ctx.body={
            mas:0,
            data:{
                title: "rss搜索结果",
                description: "使用向量搜索rss的结果",
                item:res.body.data.map(
                    item=>{
                        return {
                            title:item.meta.title,
                            link:item.meta.link,
                            description:item.meta.description,
                            vectorScore:item.similarityScore,
                            id:item.id,
                            image:item.image,
                            source:'localRssVector',
                        }
                    }
                )
            }
        }
    }
}