import { sac } from "../../../asyncModules.js";
//这是后端接口的webworker封装
import { kernelWorker } from "../../../utils/webworker/kernelWorker.js";
import {
    删除主键值
} from "../../database/publicUtils/endpoints.js";
import { 检查数据集是否已加载完成 } from "./cheker.js";
import { 获取并处理数据集所有主键 } from "./dataBaseItem.js";
import { 读取缓存的已索引结果, 写入已索引块哈希到文件 } from "./hashCache.js";
//之前胡乱写的索引器性能有严重问题,旧版的索引器需要移植了
import { 块数据集名称 } from "./name.js";
let 索引正在清理中 = false
export let 已索引块哈希 = new Set();
const 执行SQL查询并获取数据 = async (已入库块id数组) => {
    // 随机排序已入库的id数组
    // 这里使用随机查询是因为,添加数据项的时候实际上会覆盖旧的,所以清理主要是随机清理就可以
    let idSQL = `select id, hash from blocks where id IN (${已入库块id数组.map(item => `"${item}"`).join(',')})`;
    let data = await kernelWorker.SQL({ 'stmt': idSQL })
    return data;
}
const 过滤并删除多余索引 = async (随机id查询结果, 随机块哈希映射) => {
    if (随机id查询结果 && 随机id查询结果[0]) {
        let id数组1 = 随机块哈希映射.filter(
            item => {
                return !随机id查询结果.find(
                    block => {
                        return block.hash === item.meta.hash
                    }
                )
            }
        )
        if (id数组1.length) {
            sac.logger.indexwarn(`删除${id数组1.length}条多余索引`)
            await 删除主键值(块数据集名称, id数组1.map(block => block.id))
            return true
        } else {
            return false
        }
    }
}
let 间隔时间 = 2000
const 清理块索引 = async () => {
    if (索引正在清理中) {
        间隔时间 = 间隔时间 + 1000
        setTimeout(清理块索引, 间隔时间)
        return
    }
    索引正在清理中 = true
    try {
        let 数据集已加载完成 = await 检查数据集是否已加载完成(间隔时间)
        if (!数据集已加载完成) {
            间隔时间 = 间隔时间 + 500
            sac.logger.blockIndexerWarn(`块数据集未加载完成,${间隔时间 / 1000}秒之后再次尝试清理索引`)
            setTimeout(清理块索引, 间隔时间)
            索引正在清理中 = false
            return
        }
        let 已入库块哈希映射 = await 获取并处理数据集所有主键(块数据集名称)
        let 查询到的哈希数组 = 已入库块哈希映射.map(item => item.meta ? item.meta.hash : null)
        let 随机块哈希映射 = 查询到的哈希数组.sort(() => 0.5 - Math.random()).slice(0, 1000)
        let 随机id数组 = 随机块哈希映射.map(item => item.id)
        查询到的哈希数组.forEach(item => item && 已索引块哈希.add(item))
        let 查询开始时间 = performance.now()
        let id数组查询结果 = await 执行SQL查询并获取数据(随机id数组)
        let 查询结束时间 = performance.now()
        间隔时间 = (查询结束时间 - 查询开始时间) * 50
        let 清理成功 = await 过滤并删除多余索引(id数组查询结果, 随机块哈希映射, 间隔时间)
        if (!清理成功) {
            间隔时间 = 间隔时间 * 2
        }
        await 写入已索引块哈希到文件(已索引块哈希)
        if (清理成功) { sac.logger.blockIndexerInfo(`索引清理完成,${间隔时间 / 1000}秒之后再次尝试清理索引`) } else {
            sac.logger.blockIndexerInfo(`没有找到需要清理的块,${间隔时间 / 1000}秒之后再次尝试清理索引`)
        }
        setTimeout(清理块索引, 间隔时间)
        索引正在清理中 = false
    } catch (e) {
        间隔时间 = 间隔时间 + 1000
        console.error(e)
        sac.logger.blockIndexerWarn(`索引清理出错,${间隔时间 / 1000}秒之后再次尝试清理索引`)
        setTimeout(清理块索引, 间隔时间)
        索引正在清理中 = false

    }
}

export const 开始清理块索引 = () => { setTimeout(清理块索引) }