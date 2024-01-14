
export const 计算余弦相似度 = (vector1, vector2) => {
    //假设这些向量已经全部正规化了
    let dotProduct = 0;
    for (let i = 0; i < vector1.length; i++) {
        dotProduct += (vector1[i]||0) * (vector2[i]||0);
    }
    return dotProduct;
}
export const 计算欧氏距离相似度 = (vector1, vector2) => {
    let sum = 0;
    for (let i = 0; i < vector1.length; i++) {
        sum += Math.pow(vector1[i] - vector2[i], 2);
    }
    return Math.sqrt(sum);
};

