import fs from "../polyfills/fs.js";
import path from "../polyfills/path.js";
import logger from '../logger/index.js'

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
    async 加载全部数据(数据集对象){
        if (await fs.exists(this.文件保存地址)) {
            let 文件列表 = await fs.readDir(this.文件保存地址)
            let 文件路径列表 = [this.文件保存地址]
            for (let 文件项 of 文件列表) {
                if (文件项.isDir) {
                    文件路径列表.push(this.文件保存地址 + 文件项.name + '/')
                }
            }
            for (let 子文件夹路径 of 文件路径列表) {
                let log = ''
                for (let i = 0; i < this.总文件数; i++) {
                    let content = {}
                    if (await fs.exists(子文件夹路径 + 'chunk' + i + '.json')) {
                        try {
                            content = await fs.readFile(子文件夹路径 + 'chunk' + i + '.json')
                            content = JSON.parse(content)
                        } catch (e) {
                            log += 子文件夹路径 + 'chunk' + i + '.json已经损坏或不存在,将忽略' + '\n' + e.message + '\n'
                        }
                    }
                    数据集对象 = Object.assign(数据集对象, content)
                }
                if (log) {
                    if (this.logLevel === 'debug') {
                        logger.datasetwarn(log)
                    }
                }
                if (this.logLevel === 'debug') {
                    logger.datasetlog(`数据文件夹${子文件夹路径}读取完成`)
                }
            }
            return 数据集对象 
        } else {
            logger.datasetlog(this.文件保存地址, await fs.exists(this.文件保存地址))
            return {}
        }
    }
}
