import fs from "../../polyfills/fs.js";
import { 读取工作空间文件列表 } from "./glob.js"

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