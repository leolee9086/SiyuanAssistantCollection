import { text2vec } from "../../../Processors/AIProcessors/publicUtils/endpoints.js";
import { jieba } from "../../../utils/tokenizer/jieba.js";
import { 计算余弦相似度 } from "../../../utils/vector/similarity.js";
export function 准备tokens(item) {
    if ((!item.describeTokens) && item.description) {
        // 使用jieba分词库对item.describe进行分词
        item.describeTokens = jieba.tokenize(item.description, "search").filter(item=>{return item.word.length>=2});
    }
}
export function 准备评分空值(item) {
    item.scores = item.scores || {}
}
export function 准备特征向量(item) {
    item.vector = item.vector || {}
}
let lastBaseTokens = []
let lastBaseVector = []
let lastBaseString = ""
let lastBaseVectorString = ""

function 准备基准字符集(baseString) {
    if (baseString.trim() !== lastBaseString.trim()) {
        lastBaseTokens = jieba.tokenize(baseString, "search")
        lastBaseString = baseString
    }
    return lastBaseTokens.filter(item=>{return item.word.length>=2})
}
async function 准备基准向量(baseString) {
    if (baseString.trim() !== lastBaseVectorString.trim()) {
        lastBaseVectorString = ""
        lastBaseVector = []
        try {
            let res = await text2vec(baseString)
            lastBaseVector = res.body.data[0].embedding
            lastBaseVectorString = baseString
        } catch (e) {
            console,error(e)
            lastBaseVector = []
            lastBaseVectorString = ""
        }
    }
    return lastBaseVector
}
export function 根据生成时间对tips项目排序(item) {
    const now = Date.now(); // 获取当前时间的时间戳
    const timeDifference = Math.max(now - item.time, 0); // 计算时间差，忽略未来时间
    // 设置衰减率，使得5分钟后分数约为1/e
    const decayRate = -0.00002314815*10; // 每毫秒的衰减率，相当于5分钟后衰减1/e
    item.scores.time = Math.max(0, Math.exp(decayRate * timeDifference));
}
export async function 根据特征向量对tips评分(item, baseString) {
    // 确保item.describeTokens存在且为数组
    if (!item.description) {
        return 0; // 如果不存在或不是数组，返回0分
    }
    //我们这里的目标并不是对所有tips进行评分而是给出更加多样化的tips
    if(item.textScore>0.5){
        return 0
    }
    if (!item.vector['leolee9086/text2vec-base-chinese']) {
        let res = await text2vec(item.description)
        item.vector['leolee9086/text2vec-base-chinese'] = res.body.data[0].embedding
    }
    let 基准向量 = await 准备基准向量(baseString)
    if(基准向量[0]){
        item.scores.vectorScore = await 计算余弦相似度(item.vector['leolee9086/text2vec-base-chinese'], 基准向量)

    }
}
export function 根据文本内容对tips评分(item, baseString) {
    // 确保item.describeTokens存在且为数组
    if (!item.describeTokens || !Array.isArray(item.describeTokens)) {
        return 0; // 如果不存在或不是数组，返回0分
    }
    const baseTokens = 准备基准字符集(baseString); // 对baseString进行分词

    // 创建一个集合，用于存储baseTokens中的所有词
    const baseWords = new Set(baseTokens.map(token => token.word));
    
    // 创建一个集合，用于存储item.describeTokens中的所有不重复词
    const itemWords = new Set(item.describeTokens.map(token => token.word));

    // 计算itemWords中的词与baseWords的交集数量
    const intersection = [...itemWords].filter(word => baseWords.has(word)).length;

    // 计算相似度得分，这里使用交集数量除以baseTokens的大小
    const score = intersection / baseTokens.length;

    item.scores.textScore = score;
}
function 是否过于陈旧(item) {
    const tenMinutes = 10 * 60 * 1000; // 十分钟的毫秒数
    return Date.now() - item.time > tenMinutes;
}

function hasValidDescription(item) {
    const minDescriptionLength = 2;
    return item.describeTokens && item.describeTokens.length >= minDescriptionLength;
}


export async function scoreItem(item, baseString,bm25scores) {
    // 删除时间过久的项目
    if (是否过于陈旧(item)) {
        return 0; // 如果项目太旧，直接返回0分
    }
    if (!item.scores || typeof item.scores !== 'object') {
        return 0; // 如果scores不存在或不是对象，返回0分
    }

    准备评分空值(item); // 假设这个函数会填充scores对象

    准备tokens(item)
    // 删除description分词后长度小于2的项目
    if (!hasValidDescription(item)) {
        return 0; // 如果描述无效，直接返回0分
    }
    根据生成时间对tips项目排序(item); // 填充scores.time属性
    根据文本内容对tips评分(item, baseString)
    try{
    let data =bm25scores.find(doc=>{return doc.id===item.id})
    data&&(item.scores.bm25=data.score)
    }catch(e){
        console.error(e)
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
export function 修正评分(items) {
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
        item.scores.textScore = item.scores.textScore * similarityPenalty; // 应用降权到最终得分
    });
}