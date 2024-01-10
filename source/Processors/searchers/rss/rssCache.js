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
        console.log(res1)
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
                    filter:`{id:${cachePath}}`
                }
            }
        )
    }
}