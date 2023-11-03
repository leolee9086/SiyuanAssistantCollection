export const 根据相近块数量排序 = async (blocks, text, 相似度阈值) => {
    // 假设calculateSimilarity是一个函数，它接收两个文本块并返回它们的相似度
    let calculateSimilarity = (block1, block2) => {
      // 在这里实现你的相似度计算逻辑
    };
  
    // 过滤出相似度大于阈值的文本块
    let similarBlocks = blocks.filter(block => calculateSimilarity(text, block) > 相似度阈值);
  
    // 根据相似度进行排序
    similarBlocks.sort((a, b) => calculateSimilarity(text, b) - calculateSimilarity(text, a));
  
    return similarBlocks;
  };


function jaccardSimilarity(a, b) {
  const setA = new Set(a.split(' '));
  const setB = new Set(b.split(' '));
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  return intersection.size / (setA.size + setB.size - intersection.size);
}
function hammingDistance(a, b) {
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
function levenshteinDistance(a, b) {
  let matrix
  try{
   matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  }catch(e){
    console.log(a,b,e)
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

function penalizeSimilarity(item, sortedItems) {
  const similarityThreshold = 0.8;  // 可以根据需要调整
  const penaltyFactor = 0.5;  // 可以根据需要调整

  for (let sortedItem of sortedItems) {
      const similarity = combinedSimilarity(item.content, sortedItem);
      if (similarity > similarityThreshold) {
          return penaltyFactor * item.score;
      }
  }

  return item.score;
}
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