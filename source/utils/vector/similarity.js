import './horaIndex.js'
export const 计算归一化向量余弦相似度 = (vector1, vector2) => {
    //假设这些向量已经全部正规化了
    let dotProduct = 0;
    for (let i = 0; i < vector1.length; i++) {
        dotProduct += (vector1[i]||0) * (vector2[i]||0);
    }
    return dotProduct;
}
export const 计算余弦相似度 = (vector1, vector2) => {
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;
    for (let i = 0; i < vector1.length; i++) {
        const val1 = vector1[i] || 0;
        const val2 = vector2[i] || 0;
        dotProduct += val1 * val2;
        magnitude1 += val1 * val1;
        magnitude2 += val2 * val2;
    }
    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);
    if (magnitude1 === 0 || magnitude2 === 0) {
        return 0; // To avoid division by zero
    }
    return dotProduct / (magnitude1 * magnitude2);
}
export const 计算欧氏距离相似度 = (vector1, vector2) => {
    let sum = 0;
    for (let i = 0; i < vector1.length; i++) {
        sum += Math.pow(vector1[i] - vector2[i], 2);
    }
    return Math.sqrt(sum);
};
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