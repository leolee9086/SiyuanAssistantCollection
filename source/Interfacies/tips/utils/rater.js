import { jieba } from "../../../utils/tokenizer/jieba.js";
export function prepareTokens(item) {
    if ((!item.describeTokens) && item.description) {
        // 使用jieba分词库对item.describe进行分词
        item.describeTokens = jieba.tokenize(item.description,"search");
    }
}
export function prepareScores(item) {
    item.scores = item.scores || {}
}

export function scoreItemByTime(item) {
    const now = Date.now(); // 获取当前时间的时间戳
    const timeDifference = Math.max(now - item.time, 0); // 计算时间差，忽略未来时间
    // 设置衰减率，使得5分钟后分数约为1/e
    const decayRate = -0.00002314815; // 每毫秒的衰减率，相当于5分钟后衰减1/e
    item.scores.time = Math.max(0, Math.exp(decayRate * timeDifference));
}

let lastBaseTokens = []
let lastBaseString = ""
function prepareBaseTokens(baseString) {
    if (baseString.trim() !== lastBaseString.trim()) {
        lastBaseTokens = jieba.tokenize(baseString,"search")
        lastBaseString = baseString
    }
    return lastBaseTokens
}
export function scoreItemByText(item, baseString) {
    // 确保item.describeTokens存在且为数组
    if (!item.describeTokens || !Array.isArray(item.describeTokens)) {
        return 0; // 如果不存在或不是数组，返回0分
    }
    const baseTokens = prepareBaseTokens(baseString); // 对baseString进行分词

    // 创建一个集合，用于存储baseTokens中的所有词
    const baseWords = new Set(baseTokens.map(token => token.word));
    // 计算item.describeTokens中的词与baseWords的交集数量
    const intersection = item.describeTokens.filter(token => baseWords.has(token.word)).length;

    // 计算相似度得分，这里使用简单的交集数量除以基准词的数量
    const score = intersection / baseWords.size;

    item.scores.textScore = score
}
function isTooOld(item) {
    const tenMinutes = 10 * 60 * 1000; // 十分钟的毫秒数
    return Date.now() - item.time > tenMinutes;
}

function hasValidDescription(item) {
    const minDescriptionLength = 2;
    return item.describeTokens.length >= minDescriptionLength;
}

export function scoreItem(item, baseString) {
    prepareScores(item); // 假设这个函数会填充scores对象
    prepareTokens(item)
    scoreItemByTime(item); // 填充scores.time属性
    scoreItemByText(item, baseString)
    // 删除时间过久的项目
    if (isTooOld(item)) {
        return 0; // 如果项目太旧，直接返回0分
    }

    // 删除description分词后长度小于2的项目
    if (!hasValidDescription(item)) {
        return 0; // 如果描述无效，直接返回0分
    }
    if (!item.scores || typeof item.scores !== 'object') {
        return 0; // 如果scores不存在或不是对象，返回0分
    }

    let totalScore = 0;
    let scoreCount = 0;

    for (const key in item.scores) {
        if (item.scores.hasOwnProperty(key)) {
            totalScore += item.scores[key];
            scoreCount++;
        }
    }
    // 如果没有任何得分，返回0
    if (scoreCount === 0) return 0;
    // 计算平均得分
    const averageScore = totalScore / scoreCount;
    item.score = averageScore;
    item.lastScoredTime = Date.now()
    return item.score
}
export function fixScore(items) {
    const similarityThreshold = 0.8; // 设定相似度阈值
    const similarityPenaltyFactor = 0.1; // 设定相似内容的降权因子
    const scorePrecision = 0.1; // 设定得分精度
    // 使用哈希表存储四舍五入后的得分和对应的项目数量
    const scoreCounts = new Map();
    // 首先计算每个得分的项目数量
    items.forEach(item => {
        const roundedScore = Math.round((item.scores.textScore || 0) / scorePrecision) * scorePrecision;
        if (roundedScore > similarityThreshold) {
            scoreCounts.set(roundedScore, (scoreCounts.get(roundedScore) || 0) + 1);
        }
    });
    // 然后为每个项目计算降权系数
    items.forEach(item => {
        const roundedScore = Math.round((item.scores.textScore || 0) / scorePrecision) * scorePrecision;
        const similarityCount = scoreCounts.get(roundedScore) || 0;

        // 根据相似内容的数量进行降权
        const similarityPenalty = 1 - (similarityPenaltyFactor * (similarityCount - 1)); // 减1是因为要排除项目本身
        item.lastScore = item.score * similarityPenalty; // 应用降权到最终得分
    });
}