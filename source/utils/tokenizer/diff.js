export const 计算分词差异=(currentTokenResults, previousTokenResults)=>{
    // 创建两个集合，一个用于存储当前的分词结果，一个用于存储上一次的分词结果
    let currentTokenSet = new Set(currentTokenResults.map(token => token.word));
    let previousTokenSet = new Set(previousTokenResults.map(token => token.word));
    // 计算两个集合的差集，即当前分词结果中存在但上一次分词结果中不存在的词语
    let differenceSet = new Set([...currentTokenSet].filter(word => !previousTokenSet.has(word)));
    // 变化幅度定义为差集的大小
    let changeMagnitude = differenceSet.size;
    return changeMagnitude;
}