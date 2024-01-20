import logger from '../logger/index.js'
import { 计算余弦相似度, 计算欧氏距离相似度, 查找最相似点 } from './vector.js';
import  jsonSyAdapter  from '../fileSysManager/workspaceAdapters/jsonAdapter.js';
import msgSyAdapter from '../fileSysManager/workspaceAdapters/msgAdapter.js'
import { 校验主键 } from './dataBase/keys.js';
import { plugin,clientApi } from '../asyncModules.js';
globalThis._blockActionDataBase = globalThis._blockActionDataBase || {}
export class 数据库 {
    constructor(文件保存地址) {
        this.文件保存地址 = 文件保存地址
        this._数据库 = globalThis._blockActionDataBase[this.文件保存地址] || {}
        this.logLevel = 'debug'
        globalThis._blockActionDataBase[this.文件保存地址] = this._数据库
    }
    创建数据集(数据集名称, 主键名 = 'id', 文件路径名, 静态化 = false) {
        if (this._数据库[数据集名称]) {
            if (this.logLevel === 'debug') {
                logger.databaselog(`数据集:${数据集名称}已经存在,将返回`)
            } return this._数据库[数据集名称]
        }
        this._数据库[数据集名称] = new 数据集(
            数据集名称,
            主键名,
            文件路径名,
            静态化,
            this.logLevel,
            {
                文件保存地址: this.文件保存地址
            }
        )

        return this._数据库[数据集名称]
    }
}
class 数据集 {
    constructor(数据集名称, 主键名, 文件路径键名, 静态化, logLevel, 数据库) {
        //数据集对象用于存储实际数据
        this.静态化 = 静态化 ? true : false
        this.主键名 = 主键名
        this.文件路径键名 = 文件路径键名 || ''
        this.数据集名称 = 数据集名称
        this.logLevel = logLevel
        this.数据库 = 数据库
        //数据集对象临时存储了所有数据
        this.数据集对象 = {

        }
        this.文件总数 = 8
        this.待保存数据分片 = []
        this.待保存路径值 = []
        this.保存队列 = [];
        this.文件保存格式=plugin.configurer.get('向量工具设置','向量保存格式')
    }
    get 文件适配器(){
        return this.文件保存格式==='msgpack'?new msgSyAdapter(this.文件保存地址):new jsonSyAdapter(this.文件保存地址)
    }
    async 迁移数据(新数据格式){
        this.文件保存格式 = 新数据格式
        this.主键列表.forEach(
            主键值=>{
                this.记录待保存数据项(this.数据集对象[主键值])
            }
        )
        this.已经修改 =true
        await this.保存数据()
    }
    get 文件保存地址() {
        return this.数据库.文件保存地址 + '/' + this.数据集名称 + '/'
    }
    get 主键列表() {
        return Object.getOwnPropertyNames(this.数据集对象)
    }
    async 添加数据(数据组) {
        if (!数据组[0]) {
            return;
        }
        let 主键名 = this.主键名;
        let 数据集对象 = this.数据集对象;
        let 静态化 = this.静态化;
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
                this.记录待保存数据项(数据项);
                if (静态化) {
                    //如果数据是静态化的,那就添加一个拷贝
                    数据集对象[数据项主键] = structuredClone(数据项)
                } else {
                    //否则就直接添加原始数据项目
                    数据集对象[数据项主键] = 数据项;
                }
                修改标记 = true;
            }
        }
        if (修改标记) {
            this.已经修改 = true;
        }
    }
   
    根据路径获取值(path) {
        const keys = path.split('.');
        const resultKey = keys[keys.length - 1]
        let 数据集对象 = this.数据集对象
        let 查询结果 = []
        let _主键名 = this.主键名
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
                let obj = {}
                obj[_主键名] = 主键值
                obj[resultKey] = getValueByPath(数据集对象[主键值])
                查询结果.push(obj)
            }
        )
        return 查询结果
    }
    删除数据(主键名数组) {
        let 数据集对象 = this.数据集对象
        主键名数组.forEach(
            主键值 => {
                if (数据集对象[主键值]) {
                    //这里不用担心动态模式下会删除源对象.因为这个只是个引用
                    this.记录待保存数据项(数据集对象[主键值])
                    delete 数据集对象[主键值]
                }
            }
        )
        this.已经修改 = true
    }
    创建查询数据集(向量字段名, 前置过滤函数) {
        let 查询数据集 = []
        let 主键值数组 = Object.getOwnPropertyNames(this.数据集对象)
        主键值数组.forEach(
            主键值 => {
                let flag
                let 数据项 = this.数据集对象[主键值]
                if (前置过滤函数 && !前置过滤函数(数据项)) {
                    flag = true
                }
                if (!flag) {
                    查询数据集.push(
                        {
                            data: 数据项,
                            vector: 数据项[向量字段名]
                        }
                    )
                }
            }
        )
        return 查询数据集
    }
    处理查询结果(查询结果, 原始查询结果) {
        if (!原始查询结果) {
            查询结果 = 查询结果.map(
                item => {
                    let obj = structuredClone(item.data.data)
                    obj.similarityScore = item.score
                    return obj
                }
            )
        }
        return 查询结果
    }
    应用后置过滤函数(查询结果, 后置过滤函数) {
        if (后置过滤函数) {
            查询结果 = 查询结果.filter(
                item => {
                    return 后置过滤函数(item)
                }
            )
        }
        return 查询结果
    }
    以向量搜索数据(向量字段名, 向量值, 结果数量 = 10, 查询方法, 原始查询结果, 前置过滤函数, 后置过滤函数) {
        let 查询数据集 = this.创建查询数据集(向量字段名, 前置过滤函数)
        let 查询结果 = 查找最相似点(向量值, 查询数据集, 结果数量, 计算余弦相似度)
        查询结果 = this.处理查询结果(查询结果, 原始查询结果)
        查询结果 = this.应用后置过滤函数(查询结果, 后置过滤函数)
        return 查询结果
    }
    //通过主键对文件数的模,可知哪些文件需要保存
    获取主键模(主键值) {
        let num = 主键值.substring(0, 14);
        let mod = num % this.文件总数;
        return mod
    }
    记录待保存数据项(数据项) {
        let 主键模 = this.获取主键模(数据项[this.主键名])
        let 保存路径 = 数据项[this.文件路径键名]
        this.待保存数据分片[主键模] = true
        this.待保存路径值[保存路径] = true
        // 将数据项添加到保存队列
        this.保存队列.push(数据项);
    }
    async 创建分组数据(数据集对象) {
        let 分组数据 = {};
        Object.getOwnPropertyNames(数据集对象).forEach(主键值 => {
            let mod = this.获取主键模(主键值)
            let 数据项 = 数据集对象[主键值]
            if (this.待保存数据分片[mod] && this.待保存路径值[数据项[this.文件路径键名]]) {
                let 文件路径名 = 数据集对象[主键值][this.文件路径键名];
                if (!分组数据[文件路径名]) {
                    分组数据[文件路径名] = {};
                }
                分组数据[文件路径名][主键值] = 数据集对象[主键值];
            }
        });
        return 分组数据;
    }
    async 创建临时数据对象(分组数据对象, 总文件数) {
        let 临时数据对象 = {};
        for (let i = 0; i < 总文件数; i++) {
            临时数据对象[i] = {};
        }
        Object.getOwnPropertyNames(分组数据对象).forEach(主键名 => {
            let mod = this.获取主键模(主键名)
            临时数据对象[mod][主键名] = 分组数据对象[主键名];
        });
        return 临时数据对象;
    }
    async 创建写入操作(临时数据对象, 总文件数, 文件路径名) {
        let 待保存分片字典 = {}
        for (let i = 0; i < 总文件数; i++) {
            if (this.待保存数据分片[i]) {
                待保存分片字典[i] = 临时数据对象[i]
            }
        }
        let 写入操作对象 = await this.文件适配器.创建批处理写入操作(待保存分片字典, 文件路径名)
        return 写入操作对象
    }
    async 保存数据(force) {
        if (!this.已经修改) {
            return;
        }
        if (this.保存队列.length < 1000 && !force) {
            return;
        }
        logger.log('开始保存数据')
        let 总文件数 = this.文件总数;
        let 数据集对象 = this.数据集对象;
        let 分组数据 = await this.创建分组数据(数据集对象);
        for (let 文件路径名 in 分组数据) {
            let 分组数据对象 = 分组数据[文件路径名];
            let 临时数据对象 = await this.创建临时数据对象(分组数据对象, 总文件数);
            let { 写入操作, 记录数组 } = await this.创建写入操作(临时数据对象, 总文件数, 文件路径名);

            try {
                await Promise.all(写入操作);
            } catch (err) {
                console.error('写入文件时出错:', err);
            }
            if (记录数组.length == 总文件数) {
                if (this.logLevel === 'debug') {
                    logger.datasetlog(`${文件路径名}索引已更新`);
                }
            } else {
                if (this.logLevel === 'debug') {
                    logger.datasetlog(`${文件路径名}索引分片${记录数组.join(',')}已更新`)
                }
            }
        }
        this.待保存数据分片 = {};
        this.待保存路径值 = {};
        this.已经修改 = false;
    }
    async 加载数据() {
        this.数据集对象 = await this.文件适配器.加载全部数据(this.数据集对象)
    }
}
export default 数据库