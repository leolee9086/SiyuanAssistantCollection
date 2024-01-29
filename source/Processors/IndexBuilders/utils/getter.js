import { sac } from "../../../asyncModules.js";
import { kernelWorker } from "../../../utils/webworker/kernelWorker.js";
import { 添加到入库队列 } from "./adder.js";
import { 检查数据集是否已加载完成 } from "./cheker.js";
import { 获取并处理数据集所有主键 } from "./dataBaseItem.js";
let 正在获取更新的块=false
let 间隔时间 = 2000
let 哈希缓存 = new Set()
let 扫描偏移 = 0
let 扫描窗口大小 = 1000
 const 定时获取更新块= async()=>{
    if(正在获取更新的块){
        间隔时间=间隔时间+500
        setTimeout(定时获取更新块,间隔时间)
        return
    }
    正在获取更新的块=true
    if(!await 检查数据集是否已加载完成()){
        间隔时间=间隔时间+500
        sac.logger.blockIndexerWarn(`块数据集未加载完成,${间隔时间/1000}秒之后再次尝试获取块更新`)
        setTimeout(定时获取更新块,间隔时间)
        正在获取更新的块=false
        return
    }
    let id数组查询结果 =await 获取并处理数据集所有主键()
    let sql获取开始时间 = performance.now()
    let 更新块SQL = `select * from blocks where content <> '' order by updated desc limit ${扫描窗口大小} offset ${扫描偏移*扫描窗口大小}`
    let 更新块查询结果 = await kernelWorker.sql({stmt:更新块SQL})
    let sql获取结束时间 = performance.now()
    let sql获取耗时 = sql获取结束时间-sql获取开始时间
    间隔时间 = sql获取耗时*10
    let 实际更新块 = 更新块查询结果.filter(block=>{
        if(哈希缓存.has(block.id+block.hash)){
            return
        }
        哈希缓存.add(block.id+block.hash)
        let result =id数组查询结果.find(item=>{return item.meta.hash===block.hash&&item.meta.id===block.id})
        return !result
    })
    if(!更新块查询结果.length){
        扫描偏移=0
    }
    if(实际更新块.length){
        间隔时间=Math.max(间隔时间-500,2000)
        添加到入库队列(实际更新块,id数组查询结果.length)
        sac.logger.blockIndexerInfo(`找到${实际更新块.length}个新的块,${间隔时间/1000}秒之后再次尝试获取块更新`)
    }else{
        扫描偏移+=1
        间隔时间=间隔时间+100
        sac.logger.blockIndexerWarn(`没有找到新的块,${间隔时间/1000}秒之后再次尝试获取块更新`)
    }
    正在获取更新的块=false
    setTimeout(定时获取更新块,间隔时间)
}
export const 开始定时获取更新块=()=>{setTimeout(定时获取更新块)}
/*export const 定时获取更新块 = async () => {
    if (待索引数组.length) {
        setTimeout(定时获取更新块, 1000);
    }
    try {
        await sac.路由管理器.internalFetch('/database/collections/build', {
            method: "POST",
            body: {
                collection_name: 'blocks',
                main_key: 'id',
                file_path_key: 'box',
            }
        }
        );
        let id数组查询结果 = await internalFetch('/database/keys', {
            method: 'POST',
            body: {
                collection_name: 'blocks'
            }
        });
        let 已入库块哈希映射 = id数组查询结果.body.data;
        已索引块哈希 = new Set();
        for (let item of 已入库块哈希映射) {
            已索引块哈希.add(item.meta.hash);
        }

    } catch (e) {
        console.error(e);
    }
    let 初始间隔时间 = 3000;
    let 间隔时间 = 初始间隔时间; // 初始间隔时间为1000毫秒
    const 最小间隔时间 = 3000; // 最短间隔时间为1秒
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
            sac.logger.indexlog(`索引正在更新中,${间隔时间 / 1000}秒后重试`);
            return;
        }
        sac.logger.indexlog(`当前索引更新间隔为:${间隔时间 / 1000}秒`);
        let 已获取块哈希数组 = Array.from(已索引块哈希).map(hash => `'${hash}'`).join(',');
        let 更新块SQL = 已获取块哈希数组.length > 0
            ? `select * from blocks where hash NOT IN (${已获取块哈希数组}) AND content <> '' order by updated desc limit 100`
            : `select * from blocks where content <> '' order by updated desc limit 100`;
        let 更新块数据 = await kernelWorker.SQL({ 'stmt': 更新块SQL });
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
};*/
