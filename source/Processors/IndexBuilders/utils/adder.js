import * as cheerio from '../../../../static/cheerio.js'
import { sac } from "../../../asyncModules.js";
import { 学习新词组 } from '../../../utils/tokenizer/learn.js';
import { kernelWorker } from "../../../utils/webworker/kernelWorker.js";
import { text2vec } from '../../AIProcessors/publicUtils/endpoints.js';
import { 添加数据 } from '../../database/publicUtils/endpoints.js';
import { 构建块向量数据项 } from './dataBaseItem.js';
import { 块数据集名称 } from './name.js';
import { 检查数据集是否已加载完成 } from './cheker.js';
let 待入库序列 = new Map()
export const 添加到入库队列 = (待索引块数组, 现有数据量) => {   // 已索引未入库队列.push(数据项)
    sac.logger.blockIndexerInfo(`准备添加${待索引块数组.length}个块,现有数据${现有数据量}个,空块不会参与索引所以索引数据量与实际块数量可能有差异`)
    待索引块数组.forEach(
        block => {
            if (!待入库序列.get(block.id)) {
                待入库序列.set(block.id, block)
            } else {
                let _block = 待入库序列.get(block.id)
                if (_block.updated < block.updated) {
                    待入库序列.set(block.id, block)
                }
            }
        }
    )
    开始处理入库队列()
}

let 正在入库中 = false
let 间隔时间 = 1000
let 入库任务已开始
function 开始处理入库队列() {
    if (!入库任务已开始) {
        入库任务已开始 = true
        处理入库队列()
    }
}
const 处理入库队列 = async () => {
    if (正在入库中) {
        return
    }
    if (!await 检查数据集是否已加载完成()) {
        间隔时间 = 间隔时间 + 500
        sac.logger.blockIndexerWarn(`块数据集未加载完成,${间隔时间 / 1000}秒之后再次尝试添加数据`)
        setTimeout(处理入库队列, 间隔时间)
        正在入库中 = false
        return
    }
    正在入库中 = true
    if (待入库序列.size > 0) {
        let firstBlockEntry = 待入库序列.entries().next().value;
        let firstBlockId = firstBlockEntry[0];
        let firstBlock = firstBlockEntry[1];
        // 这里进行添加操作
        try {
            let 入库开始时间 = performance.now()
            await 添加块到数据库(firstBlock); // 假设你的添加操作函数名为添加操作
            // 添加操作完成后，从待入库序列中删除这个块
            待入库序列.delete(firstBlockId);
            let 入库结束时间 = performance.now()
            间隔时间 = (入库结束时间 - 入库开始时间) * 5
        } catch (error) {
            间隔时间 = 间隔时间 + 500
            console.error(`添加操作失败: ${error}`);
        }
    }
    正在入库中 = false
    setTimeout(处理入库队列, 间隔时间)
}

let 当前模型名称 = 'leolee9086/text2vec-base-chinese'

async function 添加块到数据库(块数据) {
    //容器块通过加载全文后添加
    let content =await 获取块文字内容(块数据)
    let res = await text2vec(content.slice(0, 1024))
    let 块向量 = res.body.data[0].embedding
    let 数据项 = 构建块向量数据项(块数据, 当前模型名称, 块向量)
    await 添加数据(块数据集名称, 数据项)
}
async function 获取块文字内容(块数据) {
    let { type, id } = 块数据
    //容器块通过加载全文后添加
    let content = 块数据.content
    if (type === 'd' || type === 'h' || type === 'l') {
        let doc = await kernelWorker.getDoc({ id, size: 10 })
        let $ = cheerio.load(doc.content)
        content = $('body').text()
        //这个是让分词器学习新的词组
        学习新词组(content)
    }
    //普通块直接添加
    else {
        content = 块数据.content
        学习新词组(content)
    }
    return content
}
//export let 块向量索引函数 = 逆序柯里化(为索引记录准备索引函数)(索引中块哈希)

/*try {
    await sac.路由管理器.internalFetch('/database/collections/build', {
        method: 'POST',
        body: {
            collection_name: 'blocks',
            main_key: 'id',
            file_path_key: 'box',
        }
    })
} catch (e) {
    sac.logger.indexError(e)
}
async function 处理入库队列() {
    if (正在添加) {
        return
    }
    if (已索引未入库队列.length > 0) {
        正在添加 = true
        sac.logger.indexlog(`当前入库队列长度为${已索引未入库队列.length}`)
        await 添加到块数据集(已索引未入库队列); // 将数据项添加到数据库
    }

}

async function 添加到块数据集(数据项) {
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
    } catch (e) {
        console.error(e)
    }
    sac.路由管理器.internalFetch(
        '/database/add', {
        method: "POST",
        body: {
            dataBase: 'public',
            collection_name: 'blocks',
            main_key: 'id',
            file_path_key: 'box',
            vectors: 已索引未入库队列
        }
    }
    ).then(
        res => {
            已索引未入库队列 = []
            正在添加 = false
        }
    )
}


// 使用requestIdleCallback在浏览器空闲时执行任务
function 开始处理入库队列() {
    requestIdleCallback(() => {
        处理入库队列();
        开始处理入库队列(); // 递归调用以持续处理队列
    });
}
// 初始化时开始处理队列
开始处理入库队列();
export function 定时实行块索引添加(retryInterval = 1000) {
    if (!待索引数组.length && 索引失败数组.lenght) {
        sac.logger.indexlog(`队列清空,放回${索引失败数组.lenght}个块`);
        索引失败数组.forEach(
            block => {
                待索引数组.push(block);
            }
        );
        索引失败数组 = []; // 清空索引失败数组
    }
    if (待索引数组.length > 0 && !索引正在进行中) {
        // 计算每个worker应处理的块数量
        索引正在进行中 = true;
        const workerCount = navigator.hardwareConcurrency ? navigator.hardwareConcurrency / 2 : 4;
        const 每个批次的块数量 = Math.ceil(100 / workerCount); // 确保即使不能整除也至少有一个块

        for (let i = 0; i < workerCount; i++) {
            let batchStartIndex = i * 每个批次的块数量;
            let 待处理的块数组 = 待索引数组.splice(batchStartIndex, 每个批次的块数量);
            if (待处理的块数组.length > 0) {
                let 索引开始时间 = Date.now(); // 记录索引开始的时间
                let 索引开始前已索引块数量 = 已索引块哈希.size;
                requestIdleCallback((deadline) => {
                    if (deadline.timeRemaining() < 10) {
                        return;
                    }
                    块向量索引函数(待处理的块数组, (结果数组, 其他线程索引中块数量) => {
                        let 索引结束时间 = Date.now(); // 记录索引结束的时间
                        let 索引耗时 = 索引结束时间 - 索引开始时间; // 计算索引耗时
                        let 本轮索引成功块数组 = [];
                        结果数组.forEach((结果) => {
                            if (!(结果 && 结果.data && 结果.data.length > 0)) {
                                // 当返回值中的结果的data不是一个非空数组时，根据结果的id将块放回索引失败数组
                                const 待处理块 = 待处理的块数组.find(块 => 块.id === 结果.id);
                                if (待处理块) {
                                    索引失败数组.push(待处理块);
                                }
                            } else {
                                if (结果.data[0].embedding) {
                                    const 待处理块 = 待处理的块数组.find(块 => 块.id === 结果.id);
                                    记录哈希并添加到入库队列(待处理块, 'leolee9086/text2vec-base-chinese', 结果.data[0].embedding);
                                    本轮索引成功块数组.push(待处理块);
                                } else {
                                    sac.logger.indexwarn(`id为${块.id}的块向量化失败,原因可能是网络错误或者向量化模型未加载完成`);
                                }

                            }
                        });
                        if (结果数组.length) {
                            let 总索引时间 = 平均索引时间 * 索引次数;
                            总索引时间 = 总索引时间 + (索引耗时 * workerCount);
                            索引次数 += 1;
                            平均索引时间 = 总索引时间 / 索引次数;
                            sac.logger.indexlog(`
已索引以下${本轮索引成功块数组.length}个块: \n${本轮索引成功块数组.map(块 => 块.id)};
索引中块${索引中块哈希.size}个
索引耗时:${索引耗时}毫秒,待索引块数量为${待索引数组.length}个;
本轮平均处理时长为${Math.floor(索引耗时 / 待处理的块数组.length)}毫秒,总计${待处理的块数组.length}个块,其中${待处理的块数组.length - 本轮索引成功块数组.length - 其他线程索引中块数量}个块处理失败,${其他线程索引中块数量}个块在处理中已经跳过;
已完成索引${已索引块哈希.size}个块;本轮索引开始时已成功索引数量${索引开始前已索引块数量},已经调整下一次索引时间为${Math.max(平均索引时间, retryInterval) / 1000}秒后
                        `);


                        }
                    });
                });
            }
        }
        retryInterval = Math.max(平均索引时间, retryInterval);
        索引正在进行中 = false;
        setTimeout(withPerformanceLogging(定时实行块索引添加), Math.max(retryInterval, 3000)); // 设置一个合理的间隔时间，例如1秒，以避免CPU过载
    } else {
        sac.logger.indexlog(`待索引数组为空，没有更多块需要索引。共计索引${已索引块哈希.size}个块`);
        索引正在进行中 = false;

        setTimeout(withPerformanceLogging(定时实行块索引添加), retryInterval * 2); // 设置一个合理的间隔时间，例如1秒，以避免CPU过载
    }
}
export function 记录哈希并添加到入库队列(块数据, 向量名, 向量值) {
    if (块数据) {
        索引中块哈希.delete(块数据.hash);
        已索引块哈希.add(块数据.hash);
        let 块数据项 = 构建块向量数据项(块数据, 向量名, 向量值);
        添加到入库队列(块数据项);
    }
}*/

