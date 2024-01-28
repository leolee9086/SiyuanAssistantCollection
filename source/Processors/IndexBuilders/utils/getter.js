import { sac } from "../../../asyncModules.js";
import { kernelWorker } from "../../../utils/webworker/kernelWorker.js";
import { 待索引数组, 已索引块哈希, 索引正在更新中 } from "./cleaner.js";
export const 定时获取更新块 = async () => {
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
};
