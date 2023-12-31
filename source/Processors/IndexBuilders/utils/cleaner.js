import { sac, kernelApi } from "../../../asyncModules.js";
import { 添加到入库队列 } from "./adder.js";
let { internalFetch } = sac.路由管理器
let 已索引块哈希 = new Set();
let 待索引数组 = [];
let 索引失败数组= []
let 索引中块哈希= new Set()
let 索引正在更新中 =false
export const 清理块索引 = async (数据集名称) => {
    let id数组查询结果 = await internalFetch('/database/keys', {
        method: 'POST',
        body: {
            collection_name: 数据集名称
        }
    })
    id数组查询结果.body.data.forEach(item => 已索引块哈希.add(item.meta.hash))
    let idSQL = `select id,hash from blocks  where content <> '' order by updated desc limit 102400`
    let data = kernelApi.SQL.sync({ 'stmt': idSQL })
    if (data) {
        data = data.map(item => {
            return item.id
        })
        let id数组1 = id数组查询结果.body.data.filter(
            item => { return !data.includes(item.id) }
        )
        if (id数组1.length) {
            console.log(`删除${id数组1.length}条多余索引`)
            await internalFetch('/database/delete', {
                method: "POST", body: {
                    collection_name: 数据集名称,
                    keys: id数组1.map(item=>{return item.id})
                }
            })
        }
    }
}
export const 定时获取更新块 = async () => {
    let 初始间隔时间 = 3000
    let 间隔时间 = 初始间隔时间; // 初始间隔时间为1000毫秒
    const 最小间隔时间 = 1000; // 最短间隔时间为1秒
    const 最大间隔时间 = 600000; // 最长间隔时间为十分钟

    sac.eventBus.on('ws-main', (e) => {
        if(e.detail.cmd==="transactions"){
            间隔时间 = Math.max(最小间隔时间, 间隔时间 - 10000); 
        }
      // 每次减少10秒，但不低于1秒
    });
    const 获取更新的块 = () => {
        if(索引正在更新中){
            间隔时间 = Math.min(间隔时间 +1000, 最大间隔时间);

            console.log(`索引正在更新中,${间隔时间/1000}秒后重试`)
            return  
        }
        console.log(`当前索引更新间隔为:${间隔时间 / 1000}秒`)
        let 已获取块哈希数组 = Array.from(已索引块哈希).map(hash => `'${hash}'`).join(',');
        let 更新块SQL = 已获取块哈希数组.length > 0
            ? `select * from blocks where hash NOT IN (${已获取块哈希数组}) AND content <> '' order by updated desc limit 100`
            : `select * from blocks where content <> '' order by updated desc limit 100`;
        let 更新块数据 = kernelApi.SQL.sync({ 'stmt': 更新块SQL });
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
            console.log(`未找到更新的块，增加间隔时间至${间隔时间}毫秒`);
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

export function 定时实行块索引添加(retryInterval = 1000) {
    if(!待索引数组.length&&索引失败数组.lenght){
         console.log(`队列清空,放回${索引失败数组.lenght}个块`)
         索引失败数组.forEach(
            block=>{
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
                indexBlocks(待处理的块数组, (结果数组,其他线程索引中块数量) => {
                    let 索引结束时间 = Date.now(); // 记录索引结束的时间
                    let 索引耗时 = 索引结束时间 - 索引开始时间; // 计算索引耗时
                    let 成功索引块 =[]
                    结果数组.forEach((结果) => {
                        if (!(结果 && 结果.data && 结果.data.length > 0)) {
                            // 当返回值中的结果的data不是一个非空数组时，根据结果的id将块放回索引失败数组
                            const 待处理块 = 待处理的块数组.find(块 => 块.id === 结果.id);
                            if (待处理块) {
                                索引失败数组.push(待处理块);
                            }
                        } else {
                            const 待处理块 = 待处理的块数组.find(块 => 块.id === 结果.id);
                            if (待处理块) {
                                索引中块哈希.delete(待处理块.hash);
                                已索引块哈希.add(待处理块.hash);
                                成功索引块.push(待处理块)
                                添加到入库队列(
                                    {
                                        id: 待处理块.id,
                                        meta: {
                                            link: `siyuan://blocks/${待处理块.id}`,
                                            box: 待处理块.box,
                                            hash: 待处理块.hash
                                        },
                                        vector: {
                                            'leolee9086/text2vec-base-chinese': 结果.data[0].embedding
                                        }
                                    }
                                );
                            }
                        }
                    });
                    if(结果数组.length){
                        console.log(`
已索引以下${成功索引块.length}个块: \n${成功索引块.map(块 => 块.id)};
索引中块${索引中块哈希.size}个
索引耗时:${索引耗时}毫秒,待索引块数量为${待索引数组.length}个;
本轮平均处理时长为${Math.floor(索引耗时 / 待处理的块数组.length)}毫秒,总计${待处理的块数组.length}个块,其中${待处理的块数组.length-成功索引块.length-其他线程索引中块数量}个块处理失败,${其他线程索引中块数量}个块在处理中已经跳过;
已完成索引${已索引块哈希.size}个块;本轮索引开始时已成功索引数量${索引开始前已索引块数量}
                        `);

                    }
                });
            }
        }
        setTimeout(定时实行块索引添加, retryInterval); // 设置一个合理的间隔时间，例如1秒，以避免CPU过载
    } else {
        console.log('待索引数组为空，没有更多块需要索引。');
        setTimeout(定时实行块索引添加, retryInterval); // 设置一个合理的间隔时间，例如1秒，以避免CPU过载
    }
}

// 假设的indexBlocks函数，需要实现具体的索引逻辑
function indexBlocks(blocks, callback) {
    // 索引逻辑实现...
    // 索引完成后调用回调
    let 其他线程索引中块=[]
    let strings = blocks.map(block => {
        if (索引中块哈希.has(block.hash)) {
            其他线程索引中块.push(block)
            return
        } 
        else{
            索引中块哈希.add(block.hash)
            return {id:block.id,content:block.content}
        }
    }).filter(
        item=>{return item}
    )
    if(strings[0]){
        internalFetch('/ai/v1/embedding', {
            method: "POST",
            body: {
                //这里其实直接可以不写表示默认
                model: 'leolee9086/text2vec-base-chinese',
                input: strings,
            },
            //内部调用时需要鉴权的接口也还是要鉴权的
            Headers: {
                //这里鉴权直接使用思源的鉴权码,权限最高
                "Authorization": `Bearer ${globalThis.siyuan.config.api.token}`
            }
        }).then(
            res => {
                console.log()
                callback(res.body,其他线程索引中块.length);
            }
        )
    
    }else{
        callback([],其他线程索引中块.length);
    }
}

定时实行块索引添加()

定时获取更新块();