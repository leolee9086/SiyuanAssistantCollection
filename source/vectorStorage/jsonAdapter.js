import fs from "../polyfills/fs.js";
import path from "../polyfills/path.js";
export class JsonSyAdapter {
    constructor(文件保存地址) {
        this.文件总数 = 8
        this.文件保存地址 = 文件保存地址
    }
    async 创建原子写入操作(待保存分片数据, 分片号, 文件路径名) {
        let content = await this.序列化(待保存分片数据);
        let 文件夹路径 = path.join(this.文件保存地址, 文件路径名 ? 文件路径名 : '');
        let 文件名 = path.join(文件夹路径, `chunk${分片号}.json`);
        let 原子写入记录 =  fs.writeFile(文件名, content)
        return 原子写入记录
    }
    async 创建批处理写入操作(待保存分片字典,文件路径名){
        let 写入操作数组 = []
        let 写入分片号数组 = []
        for(let 分片号 in 待保存分片字典){
            let 写入操作 = await this.创建原子写入操作(待保存分片字典[分片号],分片号,文件路径名)
            写入操作数组.push(写入操作)
            写入分片号数组.push(分片号)
        }
        return {写入操作:写入操作数组,记录数组:写入分片号数组}
    }
    
    async 序列化(data){
        return JSON.stringify(data)
    }
    async 反序列化(data){
        return JSON.parse(data)
    }
}
