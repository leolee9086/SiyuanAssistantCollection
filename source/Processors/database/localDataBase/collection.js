import logger from '../../../logger/index.js';
import jsonSyAdapter from './workspaceAdapters/jsonAdapter.js';
import msgSyAdapter from './workspaceAdapters/msgAdapter.js';
import { 校验主键 } from './keys.js';
import { plugin } from '../../../asyncModules.js';
import { 迁移为合法文件夹名称 } from './utils/fileName.js';
import { 计算LuteNodeID模 } from './utils/mod.js';
import { 准备向量查询函数 } from './utils/query.js';
import { 合并已存在数据项, 迁移数据项向量结构 } from './utils/item.js';
import { 加载数据到目标数据集 } from './workspaceAdapters/utils/loadAll.js';
import { 创建临时数据对象 } from './workspaceAdapters/utils/cache.js';
import fs from '../../../polyfills/fs.js';
let 命名常量 = {
    主键名: "id"
}
export class 数据集 {
    constructor(数据集名称, 文件路径键名, logLevel, 数据库配置) {
        //数据集对象用于存储实际数据
        this.文件路径键名 = 文件路径键名 || 命名常量.主键名;
        this.数据集名称 = 数据集名称;
        this.文件夹名称 = 迁移为合法文件夹名称(this.数据集名称)
        this.logLevel = logLevel;
        this.数据库配置 = 数据库配置;
        //数据集对象临时存储了所有数据
        this.数据集对象 = {};
        this.文件总数 = 8;
        this.待保存数据分片 = [];
        this.待保存路径值 = [];
        this.保存队列 = [];
        this.文件保存格式 = plugin.configurer.get('向量工具设置', '向量保存格式');
        this.数据迁移中 = true;
        this.准备查询函数();
        this.加载数据()
        this.数据加载完成 = false
        this.数据刷新定时任务 = setInterval(() => {
            this.同步数据()
        }, 5000)
    
        this.修改时间 = 0
    }
    async 同步数据() {
        this.索引文件名称 = this.数据库配置.文件保存地址 + '/' + this.文件夹名称 + '/index.json'

        let 远程端主键列表 = [];
        let 本地端主键列表 = this.主键列表;
        let 远程端更新时间 = 0
        let state = await fs.exists(this.索引文件名称)
        // 检查索引文件是否存在并读取
        let 合并后主键列表 = 本地端主键列表
        if (state) {
            let 索引内容 = JSON.parse(await fs.readFile(this.索引文件名称));
            远程端主键列表 = 索引内容.keys
            远程端更新时间 = 索引内容.updated
            let 需要添加的主键 = 远程端主键列表.filter(x => !本地端主键列表.includes(x));
            let 需要删除的主键 = 本地端主键列表.filter(x => !远程端主键列表.includes(x));

            if (远程端更新时间&&远程端主键列表&&(远程端更新时间 - this.修改时间) > 1000) {
                // 合并主键列表并写入索引文件
                if (需要添加的主键) {
                    console.log("远程端主键列表更新,加载新的数据")
                    合并后主键列表 = Array.from(new Set([...远程端主键列表, ...本地端主键列表]));
                    await fs.writeFile(this.索引文件名称, JSON.stringify(合并后主键列表));
                    await this.加载数据()
                }
                let data = {
                    upated: this.修改时间||Date.now(),
                    keys: 合并后主键列表
                }
                await fs.writeFile(this.索引文件名称, JSON.stringify(
                    data));
    
            }else if((需要删除的主键||需要添加的主键||this.已经修改)&&this.修改时间&&this.修改时间-远程端更新时间>2000){
                let data = {
                    upated: this.修改时间||Date.now(),
                    keys: 合并后主键列表
                }
                await fs.writeFile(this.索引文件名称, JSON.stringify(
                    data));
                await this.保存数据(false,data)
            }

        } else {
            let data = {
                upated: this.修改时间||Date.now(),
                keys: 合并后主键列表
            }
            await fs.writeFile(this.索引文件名称, JSON.stringify(
                data));
            await this.保存数据(false,data)
        }

    }
    准备查询函数() {
        this.以向量搜索数据 = (...args) => {
            let 查询函数 = 准备向量查询函数(this.数据集对象);
            return 查询函数(...args);
        };
    }
    get 已经修改() {
        return this._已经修改
    }
    set 已经修改(value) {
        this.修改时间 = Date.now()
        this._已经修改 = value
    }
    get 文件适配器() {
        return this.文件保存格式 === 'msgpack' ? new msgSyAdapter(this.文件保存地址) : new jsonSyAdapter(this.文件保存地址);
    }
    get 文件保存地址() {
        return this.数据库配置.文件保存地址 + '/' + this.文件夹名称 + '/';
    }
    get 主键列表() {
        return Object.getOwnPropertyNames(this.数据集对象);
    }
    async 迁移数据保存格式(新数据格式) {
        this.文件保存格式 = 新数据格式;
        this.主键列表.forEach(
            主键值 => {
                this.记录待保存数据项(this.数据集对象[主键值]);
            }
        );
        this.已经修改 = true;
        await this.保存数据();
    }

    async 添加数据(数据组) {
        if (!数据组[0]) {
            return;
        }
        let 主键名 = 命名常量.主键名;
        let 数据集对象 = this.数据集对象;
        let 修改标记 = false;
        // 如果数据集对象一开始是空的，标记为已经修改
        if (Object.keys(数据集对象).length === 0) {
            this.已经修改 = true;
        }
        for (let 数据项 of 数据组) {
            if (数据项 && 数据项[主键名]) {
                let 数据项主键 = 数据项[主键名];
                if (!校验主键(数据项主键)) {
                    logger.datacollecterror('主键必须以14位数字开头');
                    continue;
                }
                //改为默认静态化
                let _数据项 = JSON.parse(JSON.stringify(数据项));
                let 迁移结果 = 迁移数据项向量结构(_数据项);
                let 已存在数据项 = 数据集对象[数据项主键];
                if (已存在数据项) {
                    数据集对象[数据项主键] = 合并已存在数据项(已存在数据项, 迁移结果);
                } else {
                    数据集对象[数据项主键] = 迁移结果;
                }
                this.记录待保存数据项(数据集对象[数据项主键]);
                修改标记 = true;
            }
        }
        if (修改标记) {
            this.已经修改 = true;
        }
    }
    根据路径获取值(path) {
        const keys = path.split('.');
        const resultKey = keys[keys.length - 1];
        let 数据集对象 = this.数据集对象;
        let 查询结果 = [];
        let _主键名 = 命名常量.主键名;
        function getValueByPath(obj) {
            let value = obj;
            for (let key of keys) {
                if (value && typeof value === 'object') {
                    value = value[key];
                } else {
                    value = undefined;
                    break;
                }
            }
            return value;
        }
        this.主键列表.forEach(
            主键值 => {
                let obj = {};
                obj[_主键名] = 主键值;
                obj[resultKey] = getValueByPath(数据集对象[主键值].meta);
                查询结果.push(obj);
            }
        );
        return 查询结果;
    }
    删除数据(主键名数组) {
        console.log(主键名数组)

        let 数据集对象 = this.数据集对象;
        主键名数组.forEach(
            主键值 => {
                if (数据集对象[主键值]) {
                    //这里不用担心动态模式下会删除源对象.因为这个只是个引用
                    this.记录待保存数据项(数据集对象[主键值]);
                    delete 数据集对象[主键值];
                    this.已经修改 = true;
                }
            }
        );
    }
    记录待保存数据项(数据项) {
        let 主键值 = 数据项[命名常量.主键名];
        //通过主键对文件数的模,可知哪些文件需要保存
        let 主键模 = 计算LuteNodeID模(主键值, this.文件总数);
        let 保存路径 = 数据项.meta[this.文件路径键名];
        this.待保存数据分片[主键模] = true;
        this.待保存路径值[保存路径] = true;
        // 将数据项添加到保存队列
        this.保存队列.push(数据项);
    }
    async 创建分组数据(数据集对象) {
        let 分组数据 = {};
        Object.getOwnPropertyNames(数据集对象).forEach(主键值 => {
            let mod = 计算LuteNodeID模(主键值, this.文件总数);
            let 数据项 = 数据集对象[主键值];

            if (this.待保存数据分片[mod] && this.待保存路径值[数据项.meta[this.文件路径键名]]) {
                let 文件路径名 = 数据集对象[主键值].meta[this.文件路径键名];
                if (!分组数据[文件路径名]) {
                    分组数据[文件路径名] = {};
                }
                分组数据[文件路径名][主键值] = 数据集对象[主键值];
            }
        });
        return 分组数据;
    }

    async 创建写入操作(临时数据对象, 总文件数, 文件路径名) {
        let 待保存分片字典 = {};
        for (let i = 0; i < 总文件数; i++) {
            if (this.待保存数据分片[i]) {
                待保存分片字典[i] = 临时数据对象[i];
            }
        }
        let 操作记录数组 = await this.文件适配器.创建批处理写入操作(待保存分片字典, 文件路径名);
        return 操作记录数组;
    }
    async 写入分组数据(分组数据) {
        let 总文件数 = this.文件总数;
        for (let 文件路径名 in 分组数据) {
            let 分组数据对象 = 分组数据[文件路径名];
            let 临时数据对象 = await 创建临时数据对象(分组数据对象, 总文件数);
            let 记录数组 = await this.创建写入操作(临时数据对象, 总文件数, 文件路径名);
            if (记录数组.length == 总文件数) {
                if (this.logLevel === 'debug') {
                    console.log(`${文件路径名}索引已更新`);
                }
            } else {
                if (this.logLevel === 'debug') {
                    console.log(`${文件路径名}索引分片${记录数组.join(',')}已更新`);
                }
            }
        }
    }
    async 保存数据(强制写入,data) {
        if (!this.已经修改) {
            return;
        }
        if(this.数据保存中){
            return
        }
        if(!this.数据加载完成){
            return
        }
        if (this.保存队列.length < 100 && !强制写入) {
            return;
        }
        let 元数据 = {
            upated: this.修改时间||Date.now(),
            keys: this.主键列表
        }
        this.数据保存中 = true
        console.log('开始保存数据');
        let 数据集对象 = this.数据集对象;
        let 分组数据 = await this.创建分组数据(数据集对象);
        await this.写入分组数据(分组数据);
        await fs.writeFile(this.索引文件名称, JSON.stringify(
            data||元数据));
        this.待保存数据分片 = {};
        this.待保存路径值 = {};
        this.已经修改 = false;
        this.数据保存中 =false
    }
    async 加载数据() {
        await 加载数据到目标数据集(this.文件适配器, this)
        this.数据加载完成= true
    }
}
