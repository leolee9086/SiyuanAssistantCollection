import fs from "../../../../polyfills/fs.js";
import path from "../../../../polyfills/path.js";
import logger from '../../../../logger/index.js'
import { 读取工作空间文件列表 } from "../utils/glob.js";
export class fileChunkAdapter {
    constructor(文件保存地址, 序列化, 反序列化, 扩展名) {
        console.log(文件保存地址)
        this.总文件数 = 8
        this.文件保存地址 = 文件保存地址
        this.序列化 = 序列化
        this.反序列化 = 反序列化
        this.扩展名 = 扩展名 || "json"
        if (this.扩展名 !== 'json') {
            this.文件保存地址 = this.文件保存地址 + `_${this.扩展名}`
        }
        this.写入队列=[]
        this.正在写入=false
    }
    async 创建原子写入操作(待保存分片数据, 分片号, 文件路径名) {
        let 文件内容 = await this.序列化(待保存分片数据);
        let 文件夹路径 = path.join(this.文件保存地址, 文件路径名 ? 文件路径名 : '');
        let 文件名 = path.join(文件夹路径, `chunk${分片号}.${this.扩展名}`);
        let 原子写入记录 = fs.writeFile(文件名, 文件内容)
        return 原子写入记录
    }
    async 创建批处理写入操作(待保存分片字典, 文件路径名) {
        let 写入操作数组 = []
        let 写入分片号数组 = []
        for (let 分片号 in 待保存分片字典) {
            let 写入操作 = await this.创建原子写入操作(待保存分片字典[分片号], 分片号, 文件路径名)
            写入操作数组.push(写入操作)
            写入分片号数组.push(分片号)
        }
        try {
            await Promise.all(写入操作数组);
        } catch (err) {
            console.error('写入文件时出错:', err);
        }
        return 写入分片号数组
    }
    async 加载数据切片(文件路径, 切片编号, 反序列化函数) {
        let content = {}
        if (await fs.exists(文件路径 + 'chunk' + 切片编号 + `.${this.扩展名}`)) {
            try {
                content = await fs.readFile(文件路径 + 'chunk' + 切片编号 + `.${this.扩展名}`)
                content = await 反序列化函数(content)

            } catch (e) {
                return { error: 文件路径 + 'chunk' + 切片编号 + `.${this.扩展名}` + '已经损坏或不存在,将忽略' + '\n' + e.message + '\n' }
            }
        }
        return { content: content }
    }
    async 处理日志(log, 子文件夹路径) {
        if (log) { logger.datasetwarn(log) }
        logger.datasetlog(`数据文件夹${子文件夹路径}读取完成`)
    }
    async 加载全部数据(数据集对象) {
        if (await fs.exists(this.文件保存地址)) {
            let 文件路径列表 = await 读取工作空间文件列表(this.文件保存地址)
            for (let 子文件夹路径 of 文件路径列表) {
                let log = ''
                for (let i = 0; i < this.总文件数; i++) {
                    let { error, content } = await this.加载数据切片(子文件夹路径, i, this.反序列化)
                    if (error) {
                        log += error
                    }
                    数据集对象 = Object.assign(数据集对象, content)
                }
                await this.处理日志(log, 子文件夹路径)
            }
            return 数据集对象
        } else {
            logger.datasetlog(this.文件保存地址, await fs.exists(this.文件保存地址))
            return {}
        }
    }
}