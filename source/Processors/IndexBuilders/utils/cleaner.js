import { sac, kernelApi } from "../../../asyncModules.js";
import { 添加到入库队列 } from "./adder.js";
import fs from "../../../polyfills/fs.js";
import { 构建块向量数据项 } from "./dataBaseItem.js";
import { 为索引记录准备索引函数 } from "./indexer.js";
import { 逆序柯里化, 柯里化 } from "../../../utils/functionTools.js";
let { internalFetch } = sac.路由管理器
let 已索引块哈希 = new Set();
let 待索引数组 = [];
let 索引失败数组 = []
let 索引中块哈希 = new Set()
let 索引正在更新中 = false
let 块向量索引函数 = 逆序柯里化(为索引记录准备索引函数)(索引中块哈希)
export const 清理块索引 = async (数据集名称, 间隔时间 = 3000) => {
    try {
        let 数据集状态 = await internalFetch('/state', {
            method: 'POST',
            body: {
                collection_name: 数据集名称
            }
        })
        if (!数据集状态.body.dataLoaded) {
            sac.logger.indexlog('数据集加载未完成,跳过本轮清理')
        }
    } catch (e) {
        setTimeout(() => { 清理块索引(数据集名称, 间隔时间) }, 间隔时间)
    }
    let id数组查询结果 = await internalFetch('/database/keys', {
        method: 'POST',
        body: {
            collection_name: 数据集名称
        }
    })
    let 已入库块哈希映射 = id数组查询结果.body.data
    for (let item of 已入库块哈希映射) {
        已索引块哈希.add(item.meta.hash)
    }
    if (await fs.exists('/temp/noobTemp/blockHashs.json')) {
        let 缓存的已索引结果 = JSON.parse(await fs.readFile('/temp/noobTemp/blockHashs.json'))
        缓存的已索引结果.forEach(item => 已索引块哈希.add(item))
    }
    let idSQL = `select id,hash from blocks  where content <> '' order by updated desc limit 102400`
    let data = await kernelApi.SQL({ 'stmt': idSQL })

    if (data && data[0]) {
        data = data.map(item => {
            return item.id
        })
        let id数组1 = 已入库块哈希映射.filter(
            item => { return !data.includes(item.id) }
        )
        if (id数组1.length) {
            sac.logger.indexwarn(`删除${id数组1.length}条多余索引`)
            await internalFetch('/database/delete', {
                method: "POST", body: {
                    collection_name: 数据集名称,
                    keys: id数组1.map(item => { return item.id })
                }
            })
            间隔时间 = Math.max(间隔时间 * 2, 15 * 1000)
            setTimeout(() => { 清理块索引(数据集名称, 间隔时间) }, 间隔时间)
        } else {
            间隔时间 = Math.min(间隔时间 * 2, 15 * 1000 * 60)
            sac.logger.indexlog(`没有多余索引需要清除,当前索引清理时间为${间隔时间}`)
            setTimeout(() => { 清理块索引(数据集名称, 间隔时间) }, 间隔时间)
        }
    }


    await fs.writeFile('/temp/noobTemp/blockHashs.json', JSON.stringify(Array.from(已索引块哈希)))
}
export const 定时获取更新块 = async () => {
    try {
        await sac.路由管理器.internalFetch('/database/collections/build', {
            method: "POST",
            body: {
                collection_name: 'blocks',
                main_key: 'id',
                file_path_key: 'box',
            }
        }

        )
        let id数组查询结果 = await internalFetch('/database/keys', {
            method: 'POST',
            body: {
                collection_name: 'blocks'
            }
        })
        let 已入库块哈希映射 = id数组查询结果.body.data
        已索引块哈希 = new Set()
        for (let item of 已入库块哈希映射) {
            已索引块哈希.add(item.meta.hash)
        }

    } catch (e) {
        console.error(e)
    }
    let 初始间隔时间 = 3000
    let 间隔时间 = 初始间隔时间; // 初始间隔时间为1000毫秒
    const 最小间隔时间 = 1000; // 最短间隔时间为1秒
    const 最大间隔时间 = 600000; // 最长间隔时间为十分钟
    sac.eventBus.on('ws-main', (e) => {
        if (e.detail.cmd === "transactions") {
            间隔时间 = Math.max(最小间隔时间, 间隔时间 - 10000);
        }
        // 每次减少10秒，但不低于1秒
    });
    const 获取更新的块 = async () => {
        if (索引正在更新中) {
            间隔时间 = Math.min(间隔时间 + 1000, 最大间隔时间);
            sac.logger.indexlog(`索引正在更新中,${间隔时间 / 1000}秒后重试`)
            return
        }
        sac.logger.indexlog(`当前索引更新间隔为:${间隔时间 / 1000}秒`)
        let 已获取块哈希数组 = Array.from(已索引块哈希).map(hash => `'${hash}'`).join(',');
        let 更新块SQL = 已获取块哈希数组.length > 0
            ? `select * from blocks where hash NOT IN (${已获取块哈希数组}) AND content <> '' order by updated desc limit 100`
            : `select * from blocks where content <> '' order by updated desc limit 100`;
        let 更新块数据 = await kernelApi.SQL({ 'stmt': 更新块SQL });
        if (更新块数据 && 更新块数据.length > 0) {
            更新块数据.forEach(块 => {
                if (!已索引块哈希.has(块.hash)) {
                    待索引数组.push(块);
                }
            });
            // 有新的块时，重置间隔时间
            间隔时间 = 初始间隔时间;
        } else {
            // 如果没有获取到新的块，指数级增加间隔时间，但不超过最大间隔时间
            间隔时间 = Math.min(间隔时间 * 2, 最大间隔时间);

            sac.logger.indexlog(`未找到更新的块，增加新内容发现间隔时间至${间隔时间}毫秒`);
        }
    };

    const 定时执行 = () => {
        setTimeout(async () => {
            await 获取更新的块();
            定时执行(); // 递归调用以保持间隔
        }, 间隔时间);
    };

    定时执行(); // 初始调用
};
function 记录哈希并添加到入库队列(块数据, 向量名, 向量值) {
    if (块数据) {
        索引中块哈希.delete(块数据.hash);
        已索引块哈希.add(块数据.hash);
        let 块数据项 = 构建块向量数据项(块数据, 向量名, 向量值)
        添加到入库队列(块数据项);
    }
}


let 索引次数 = 1
let 平均索引时间 = 0
export function 定时实行块索引添加(retryInterval = 1000) {
    if (!待索引数组.length && 索引失败数组.lenght) {
        sac.logger.indexlog(`队列清空,放回${索引失败数组.lenght}个块`)
        索引失败数组.forEach(
            block => {
                待索引数组.push(block)
            }
        )
        索引失败数组 = []; // 清空索引失败数组
    }
    if (待索引数组.length > 0) {
        // 计算每个worker应处理的块数量
        const workerCount = navigator.hardwareConcurrency ? navigator.hardwareConcurrency / 2 : 4;
        const 每个批次的块数量 = Math.ceil(50 / workerCount); // 确保即使不能整除也至少有一个块

        for (let i = 0; i < workerCount; i++) {
            let batchStartIndex = i * 每个批次的块数量;
            let 待处理的块数组 = 待索引数组.splice(batchStartIndex, 每个批次的块数量);
            if (待处理的块数组.length > 0) {
                let 索引开始时间 = Date.now(); // 记录索引开始的时间
                let 索引开始前已索引块数量 = 已索引块哈希.size
                块向量索引函数(待处理的块数组, (结果数组, 其他线程索引中块数量) => {
                    let 索引结束时间 = Date.now(); // 记录索引结束的时间
                    let 索引耗时 = 索引结束时间 - 索引开始时间; // 计算索引耗时
                    let 本轮索引成功块数组 = []
                    结果数组.forEach((结果) => {
                        if (!(结果 && 结果.data && 结果.data.length > 0)) {
                            // 当返回值中的结果的data不是一个非空数组时，根据结果的id将块放回索引失败数组
                            const 待处理块 = 待处理的块数组.find(块 => 块.id === 结果.id);
                            if (待处理块) {
                                索引失败数组.push(待处理块);
                            }
                        } else {
                            if(结果.data[0].embedding){
                                const 待处理块 = 待处理的块数组.find(块 => 块.id === 结果.id);
                                记录哈希并添加到入库队列(待处理块, 'leolee9086/text2vec-base-chinese', 结果.data[0].embedding)
                                本轮索引成功块数组.push(待处理块)
                            }else{
                                sac.logger.indexwarn(`id为${块.id}的块向量化失败,原因可能是网络错误或者向量化模型未加载完成`)
                            }

                        }
                    });
                    if (结果数组.length) {
                        let 总索引时间 = 平均索引时间 * 索引次数
                        总索引时间 = 总索引时间 + (索引耗时 * workerCount)
                        索引次数 += 1
                        平均索引时间 = 总索引时间 / 索引次数 / workerCount
                        sac.logger.indexlog(`
已索引以下${本轮索引成功块数组.length}个块: \n${本轮索引成功块数组.map(块 => 块.id)};
索引中块${索引中块哈希.size}个
索引耗时:${索引耗时}毫秒,待索引块数量为${待索引数组.length}个;
本轮平均处理时长为${Math.floor(索引耗时 / 待处理的块数组.length)}毫秒,总计${待处理的块数组.length}个块,其中${待处理的块数组.length - 本轮索引成功块数组.length - 其他线程索引中块数量}个块处理失败,${其他线程索引中块数量}个块在处理中已经跳过;
已完成索引${已索引块哈希.size}个块;本轮索引开始时已成功索引数量${索引开始前已索引块数量},已经调整下一次索引时间为${Math.max(平均索引时间, retryInterval) / 1000}秒后
                        `);


                    }
                });
            }
        }
        retryInterval = Math.max(平均索引时间, retryInterval)
        setTimeout(定时实行块索引添加, Math.max(retryInterval, 1000)); // 设置一个合理的间隔时间，例如1秒，以避免CPU过载
    } else {
        sac.logger.indexlog(`待索引数组为空，没有更多块需要索引。共计索引${已索引块哈希.size}个块`);
        setTimeout(定时实行块索引添加, retryInterval * 2); // 设置一个合理的间隔时间，例如1秒，以避免CPU过载
    }
}


定时实行块索引添加()
定时获取更新块();