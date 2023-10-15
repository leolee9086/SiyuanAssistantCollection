import { 使用worker处理数据 } from "./workerHandler.js";
import { plugin } from "../asyncModules.js";
const 向量生成器地址 =`/plugins/SiyuanAssistantCollection/source/vectorStorage/embeddingWorker.js`
const 向量工具设置 = plugin.configurer.get('向量工具设置').$value

export const 计算Levenshtein距离 = (a, b) => {
    const m = a.length;
    const n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    // 创建二维数组来存储计算过程中的中间结果
    const dp = Array.from(Array(m + 1), () => Array(n + 1).fill(0));
    // 初始化第一行和第一列
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
    }
    // 计算Levenshtein距离
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (a[i - 1] === b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j - 1] + 1,
                    dp[i][j - 1] + 1,
                    dp[i - 1][j] + 1
                );
            }
        }
    }
    return dp[m][n];
}
export async function 提取文本向量(文本) {
    await 使用worker处理数据(
        向量工具设置,
        向量生成器地址,
        '初始化配置',
        false
    )
    return await 使用worker处理数据(文本, '/plugins/SiyuanAssistantCollection/source/vectorStorage/embeddingWorker.js', '提取向量')
}
export {提取文本向量 as embeddingText}

