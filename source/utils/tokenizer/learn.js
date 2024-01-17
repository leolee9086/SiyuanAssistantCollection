import { jieba } from './jieba.js'
import { kernelApi, sac } from '../../asyncModules.js';
import cheerio from '../../../static/cheerio.js'
import fs from '../../polyfills/fs.js'
import { 计算平均值和标准差 } from '../statistics/index.js';
import { 判定是否虚词开头或结尾, 判定是否标点符号开头结尾或全部 } from '../text/assert.js';
let 组合频率字典 = sac.statusMonitor.get('meta', 'tokens').$value || new Map();
let 已处理组合 = {};
let 已学习词典 = new Set(); // 初始化一个新的Set来存储已学习的词组
let 学习中 = false
sac.statusMonitor.set('meta', 'tokens', 组合频率字典)
export async function 学习新词组(文本) {
    if (学习中) {
        setTimeout(() => 学习新词组(文本), 2000)
    }
    学习中 = true
    try {
        const 分词结果 = await jieba.tokenize(文本, "search");
        for (const [索引, 当前分词] of 分词结果.entries()) {
            if (!当前分词.word.trim()) continue; // 如果当前分词是空文本，则跳过
            let 当前位置 = 当前分词.end; // 假设分词结果包含 end 属性
            for (let i = 索引 + 1; i < 分词结果.length; i++) {
                let 组合 = 当前分词.word;
                let j = 索引 + 1;
                // 从当前分词开始向后构建所有可能的连续子串
                while (j <= i) {
                    const 下一个分词 = 分词结果[j];
                    if (!下一个分词.word.trim()) break; // 如果下一个分词是空文本，则停止当前组合的构建

                    // 检查下一个分词是否紧跟当前分词
                    if (下一个分词.start === 当前位置) {
                        组合 += 下一个分词.word;
                        当前位置 = 下一个分词.end; // 更新当前位置
                    } else {
                        break; // 如果不连续，停止当前组合的构建
                    }
                    j++;
                }
                // 如果组合在构建过程中遇到虚词或标点，或者 j 没有达到 i（说明中间断开了），则不更新频率
                if (j <= i || 判定是否虚词开头或结尾(组合) || 判定是否标点符号开头结尾或全部(组合)) {
                    break;
                }
                // 更新组合频率
                await 更新组合频率(组合);
            }
        }
        await 处理组合频率并添加新词();
        await fs.writeFile('/data/public/sac-tokenizer/frequence.json', JSON.stringify([...组合频率字典]));
    } catch (e) {
        console.warn(e)
    }
    学习中 = false
}

async function 更新组合频率(组合) {
    if (!组合频率字典.has(组合)) {
        组合频率字典.set(组合, 0);
    }
    组合频率字典.set(组合, 组合频率字典.get(组合) + 1);
}

function 显著性判断(频率, 平均值, 标准差) {
    // 这里我们使用平均值加上两倍标准差作为阈值
    return 频率 > 平均值 + 3 * 标准差;
}

async function 处理组合频率并添加新词() {
    // 移除极端值后计算平均值和标准差
    const 频率值 = Object.values(组合频率字典);
    const 过滤后的频率值 = 频率值.filter(频率 => {
        // 这里可以根据需要调整过滤条件
        return 频率 > 1 && 频率 < 频率值.length;
    });
    const { 平均值, 标准差 } = 计算平均值和标准差(过滤后的频率值);

    const 组合 = Object.keys(组合频率字典).find(组合 => !已处理组合[组合]);
    const 频率 = 组合频率字典[组合];
    if (显著性判断(频率, 平均值, 标准差) && Object.keys(组合频率字典).length > 1000) {
        jieba.add_word(组合);
        sac.logger.tokenizerInfo(`学习到新的组合『${组合}』,已经添加到词典中`);
        已学习词典.add(组合); // 将新学习的组合添加到已学习词典中
        await fs.writeFile('/data/public/sac-tokenizer/dict.json', JSON.stringify(Array.from(已学习词典)))

    }
    已处理组合[组合] = true;

    if (Object.keys(组合频率字典).some(组合 => !已处理组合[组合])) {
        setTimeout(处理组合频率并添加新词, 2000);
    } else {
        setTimeout(处理组合频率并添加新词, 4000);
    }
}

// 启动空闲时间处理
setTimeout(处理组合频率并添加新词, 2000);

function getOneWeekAgo() {
    const date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}${second}`;
}
// 使用sql函数从SQLite数据库中查询长度超过100的块
async function 随机抽取长块() {
    const oneWeekAgo = getOneWeekAgo();
    const query = `SELECT id FROM blocks WHERE  updated > ${oneWeekAgo} AND type="d" ORDER BY RANDOM() LIMIT 1;`;
    const blocks = await kernelApi.sql({ stmt: query });
    const doc = await kernelApi.getDoc({ id: blocks[0].id })
    if (blocks && blocks.length > 0) {
        const $ = cheerio.load(doc.content);
        const textContent = $('body').text();
        return textContent;
    }
    return null; // 如果没有找到合适的块，返回null
}
// 每隔一秒钟学习一个块的内容
function 定时学习新词组() {
    setInterval(async () => {
        const content = await 随机抽取长块();
        if (content) {
            await 学习新词组(content);
        }
    }, 2000);
}

定时学习新词组();
