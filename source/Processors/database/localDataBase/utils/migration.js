import fs from "../../../../polyfills/fs.js";
import { 读取工作空间文件列表 } from "./glob.js"
import 数据库 from "../index.js";
export const 迁移数据 =async (迁出适配器,迁入适配器)=>{
    let 迁出地址 = 迁出适配器.文件保存地址
    let 迁入地址 = 迁入适配器.文件保存地址
    let 文件列表 = 读取工作空间文件列表(迁出地址)
    for(let 文件项 of 文件列表){
        let 文件内容 =await 迁出适配器.反序列化(await fs.readFile(文件项))
        let 迁入文件地址 = 文件项.replace(迁出地址,迁入地址)
        await fs.writeFile (迁入文件地址,await 迁入适配器.序列化(文件内容))
    }    
}
export const 从测试版迁移数据= async(迁出数据,旧版数集名称,新版数据集)=>{
    let 公开数据库 = new 数据库('/data/public/vectorStorage')
    let 测试数据集 = 公开数据库.创建数据集('_blocks','box')
    await 测试数据集.加载数据()
    let 正式数据集 = 公开数据库.创建数据集('blocks','box')
    setTimeout(
        async()=>{
            console.log(Object.keys(测试数据集.数据集对象).length)

            for(let 数据id in 测试数据集.数据集对象){
                let 数据项 = 测试数据集.数据集对象[数据id]
                try{
                await 正式数据集.添加数据([{
                    id:数据id,
                    meta:数据项.meta,
                    vector:数据项.vector
                }])
                }catch(e){}
            }
            console.error(`测试数据导入完成`)

        },100000
    )
 
}