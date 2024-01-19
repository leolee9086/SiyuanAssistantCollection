import { jieba } from './jieba.js'
import { kernelApi, sac } from '../../asyncModules.js';
import cheerio from '../../../static/cheerio.js'
import fs from '../../polyfills/fs.js'
import { 计算平均值和标准差 } from '../statistics/index.js';
import { 判定是否虚词开头或结尾, 判定是否标点符号开头结尾或全部 } from '../text/assert.js';
let 组合频率字典 = new Map();
try {
    let frequence = await fs.readFile('/data/public/sac-tokenizer/frequence.json', 'utf8');
    frequence = JSON.parse(frequence);
    for (const [key, value] of Object.entries(frequence)) {
        组合频率字典.set(key, value);
    }
} catch (e) {
    console.error(e);
}
let 已处理组合 = {};
let 已学习词典 = new Set(); // 初始化一个新的Set来存储已学习的词组
let 已处理文本 = new Set()
try {
    let dict = await fs.readFile('/data/public/sac-tokenizer/dict.json')

    dict = JSON.parse(dict)
    dict.forEach(
        word => {
            word && 已学习词典.add(word)
        }
    )
} catch (e) {
    console.warn(e)
}
let 学习中 = false
sac.statusMonitor.set('meta', 'tokens', 组合频率字典)
export async function 学习新词组(文本) {
    if (学习中) {
        return
    }
    if(已处理文本.has(文本.substring(0,1024))){
        return
    }
    已处理文本.add(文本.substring(0,1024))
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
        await fs.writeFile('/data/public/sac-tokenizer/frequence.json', JSON.stringify(Object.fromEntries(组合频率字典)));
    }
    catch (e) {
        console.warn(e)
    }
    清理组合频率字典()
    学习中 = false
}

async function 更新组合频率(组合) {
    if(组合.length<=2){
        return
    }
    if (!组合频率字典.has(组合)) {
        组合频率字典.set(组合, 0);
    }
    组合频率字典.set(组合, 组合频率字典.get(组合) + 1);
}
async function 清理组合频率字典() {
    if (组合频率字典.size > 10000) {
        // 首先删除所有频率为1的项
        for (let [组合, 频率] of 组合频率字典) {
            if (频率 === 1) {
                组合频率字典.delete(组合);
            }
        }
        // 如果删除频率为1的项后仍然超过10000，继续删除频率最低的项
        while (组合频率字典.size > 10000) {
            let 最低频率组合 = null;
            let 最低频率 = Infinity;
            for (let [组合, 频率] of 组合频率字典) {
                if (频率 < 最低频率) {
                    最低频率 = 频率;
                    最低频率组合 = 组合;
                }
            }
            if (最低频率组合 !== null) {
                组合频率字典.delete(最低频率组合);
            } else {
                // 如果所有项的频率都相同，则可以选择随机删除或者采取其他策略
                break; // 或者可以抛出一个错误或者返回一个状态表示无法进一步清理
            }
        }
    }
}
function 显著性判断(频率, 平均值, 标准差) {
    // 这里我们使用平均值加上两倍标准差作为阈值
    return 频率 > 平均值 + 3 * 标准差;
}

async function 处理组合频率并添加新词() {
    // 移除极端值后计算平均值和标准差
    const 频率值 = Array.from(组合频率字典.values());

    const 过滤后的频率值 = 频率值.filter(频率 => {
        // 这里可以根据需要调整过滤条件
        return 频率 > 1 && 频率 < 频率值.length;
    });
    const { 平均值, 标准差 } = 计算平均值和标准差(过滤后的频率值);
    const 组合 = Array.from(组合频率字典.keys()).find(组合 => !已处理组合[组合]);
    const 频率 = 组合频率字典.get(组合);
    if (显著性判断(频率, 平均值, 标准差) && 组合频率字典.size > 1000) {
        jieba.add_word(组合);
        sac.logger.tokenizerInfo(`学习到新的组合『${组合}』,已经添加到词典中`);
        已学习词典.add(组合); // 将新学习的组合添加到已学习词典中
        已处理组合[组合] = true;

        await fs.writeFile('/data/public/sac-tokenizer/dict.json', JSON.stringify(Array.from(已学习词典)));
    }
    已处理组合[组合] = true;

    if (Array.from(组合频率字典.keys()).some(组合 => !已处理组合[组合])) {
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
