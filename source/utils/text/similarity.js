/**
 * 计算两个字符串的Jaccard相似度。
 * Jaccard相似度是两个集合交集的大小除以并集的大小。
 * 这个函数首先将输入的字符串按空格分割成单词集合，然后计算这两个集合的Jaccard相似度。
 *
 * @param {string} a - 第一个输入字符串
 * @param {string} b - 第二个输入字符串
 * @returns {number} - 返回两个输入字符串的Jaccard相似度，范围在0到1之间，1表示完全相同，0表示完全不同
 */
export const jaccardSimilarity = (a, b) => {
    const setA = new Set(a.split(' '));
    const setB = new Set(b.split(' '));
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    return intersection.size / (setA.size + setB.size - intersection.size);
}
/**
 * 计算两个字符串的汉明距离。
 * 汉明距离是两个等长字符串在相同位置上不同字符的数量。
 * 如果输入的两个字符串长度不同，函数会抛出错误。
 *
 * @param {string} a - 第一个输入字符串
 * @param {string} b - 第二个输入字符串
 * @returns {number} - 返回两个输入字符串的汉明距离
 * @throws {Error} - 如果两个输入字符串的长度不同，会抛出错误
 */
export const hammingDistance = (a, b) => {
    if (a.length !== b.length) {
        throw new Error('Strings must be of the same length');
    }
    let distance = 0;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            distance++;
        }
    }
    return distance;
}

/**
 * 计算两个字符串之间的Levenshtein距离。
 * Levenshtein距离是指两个字符串之间，由一个转换成另一个所需的最少编辑操作次数。
 * 允许的编辑操作包括将一个字符替换成另一个字符，插入一个字符，或删除一个字符。
 *
 * @param {string} a - 第一个字符串
 * @param {string} b - 第二个字符串
 * @returns {number} 返回两个字符串之间的Levenshtein距离
 */
export const levenshteinDistance=(a, b)=>{
    let matrix;
    try {
      matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
    } catch(e) {
      console.log(a, b, e);
    }
    for (let i = 0; i <= a.length; i++) { matrix[0][i] = i; }
    for (let j = 0; j <= b.length; j++) { matrix[j][0] = j; }
    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const substitutionCost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1,
          matrix[j][i - 1] + 1,
          matrix[j - 1][i - 1] + substitutionCost
        );
      }
    }
    return matrix[b.length][a.length];
  }

  /**
 * 计算两个字符串的组合相似度。
 * 使用了Levenshtein、Jaccard和Hamming三种相似度计算方法，并对结果进行加权平均。
 *
 * @param {string} a - 第一个字符串
 * @param {string} b - 第二个字符串
 * @returns {number} 返回两个字符串的组合相似度得分
 */
export function combinedSimilarity(a, b) {
    // 这些权重可以根据你的具体需求进行调整
    const weights = {
        levenshtein: 0.3,
        jaccard: 0.4,
        hamming: 0.3
    };
  
    const levenshteinScore = levenshteinDistance(a, b);
    const jaccardScore = jaccardSimilarity(a, b);
    const hammingScore = a.length === b.length ? hammingDistance(a, b) : Infinity;
  
    // 计算加权得分
    const combinedScore = weights.levenshtein * levenshteinScore
                        + weights.jaccard * jaccardScore
                        + weights.hamming * hammingScore;
  
    return combinedScore;
  }

  /**
 * 计算两个字符串的组合相似度，并对相似度进行惩罚处理。
 * 使用了Levenshtein、Jaccard和Hamming三种相似度计算方法，并对结果进行加权平均。
 * 如果已排序的项目中存在与当前项目相似的项目，则对相似度得分进行惩罚处理。
 *
 * @param {string} a - 第一个字符串
 * @param {string} b - 第二个字符串
 * @param {Array} sortedItems - 已排序的项目列表
 * @returns {number} 返回经过惩罚处理的组合相似度得分
 */
export function combinedSimilarityWithPenalty(a, b, sortedItems) {
    // 计算相似度
    const combinedScore = combinedSimilarity(a, b);
  
    // 创建一个虚拟的搜索结果项，以便我们可以使用penalizeSimilarity函数
    const item = { content: a, score: combinedScore };
  
    // 应用惩罚因子
    let penalizedScore=combinedScore
    if(sortedItems[0]){
      penalizedScore = penalizeSimilarity(item, sortedItems);
    }
    return penalizedScore;
}