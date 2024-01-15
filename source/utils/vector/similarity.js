
export const 计算余弦相似度 = (vector1, vector2) => {
    //假设这些向量已经全部正规化了
    let dotProduct = 0;
    for (let i = 0; i < vector1.length; i++) {
        dotProduct += (vector1[i]||0) * (vector2[i]||0);
    }
    return dotProduct;
}
export const 计算余弦相似度32位 = (vector1, vector2) => {
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

