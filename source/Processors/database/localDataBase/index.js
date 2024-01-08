import logger from '../../../logger/index.js'
import { 数据集 } from './collection.js';
globalThis._blockActionDataBase = globalThis._blockActionDataBase || {}
export class 数据库 {
    constructor(文件保存地址) {
        this.文件保存地址 = 文件保存地址
        this._数据库 = globalThis._blockActionDataBase[this.文件保存地址] || {}
        this.logLevel = 'debug'
        globalThis._blockActionDataBase[this.文件保存地址] = this._数据库
    }
    创建数据集(数据集名称, 文件路径名) {
        if (this._数据库[数据集名称]) {
            if (this.logLevel === 'debug') {
                logger.databaselog(`数据集:${数据集名称}已经存在,将返回`)
            }
            return this._数据库[数据集名称]
        }
        this._数据库[数据集名称] = new 数据集(
            数据集名称,
            文件路径名,
            this.logLevel,
            {
                文件保存地址: this.文件保存地址
            }
        )
        return this._数据库[数据集名称]
    }
    根据名称获取数据集(数据集名称) {
        return this._数据库[数据集名称]
    }
}
export default 数据库