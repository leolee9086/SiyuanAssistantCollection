import { 动作总表 } from "./index.js";
export async function 根据上下文获取动作表(context, signal) {
    let 备选动作表 = []
    if (signal && signal.aborted) {
        return 备选动作表
    }
    // 根据上次生成耗时对动作表进行排序
    动作总表.sort((a, b) => (动作表耗时[a] || 0) - (动作表耗时[b] || 0));
    for (let i = 0; i < 动作总表.length; i++) {
        if (signal && signal.aborted) {
            return []
        }
        try {
            let 动作表 = 动作总表[i];
            let startTime = Date.now(); // 记录开始时间
            await 处理动作表(动作表, 备选动作表, context, signal)
            let endTime = Date.now(); // 记录结束时间
            动作表耗时[动作表] = endTime - startTime; // 计算并存储耗时
        } catch (e) {
            logger.actionListwarn(e, 动作总表[i]);
        }
    }
    console.log(备选动作表)
    return 备选动作表
}
