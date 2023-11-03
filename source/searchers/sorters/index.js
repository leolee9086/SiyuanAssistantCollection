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