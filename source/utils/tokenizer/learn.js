import {jieba} from './jieba.js'
import { 校验分词是否连续, 校验是否包含 } from './utils.js';
import { kernelApi,sac } from '../../asyncModules.js';
import cheerio from '../../../static/cheerio.js'
let 组合频率字典 = sac.statusMonitor.get('meta','tokens').$value||new Map();
sac.statusMonitor.set('meta','tokens',组合频率字典)

function 更新组合频率(前一个分词, 后一个分词) {
    let 组合 = 前一个分词.word + 后一个分词.word;
    // 需要排除的虚词列表
    const 虚词 = ['的', '地', '得', '和', '或', '并', '之', '于', '以', '抑', '乃', '则', '者', '又'];

    // 检查组合是否以虚词开头或结尾
    const 是虚词开头或结尾 = 虚词.some(词 => 组合.startsWith(词) || 组合.endsWith(词));

    // 检查组合是否全部为非标点符号和非空，且不以虚词开头或结尾
    if (组合 && !/[\p{P}\s]/gu.test(组合) && !是虚词开头或结尾) {
        if (组合频率字典[组合]) {
            组合频率字典[组合]++;
        } else {
            组合频率字典[组合] = 1;
        }
    }
}
function 计算平均值和标准差(频率字典) {
    const 频率值 = Object.values(频率字典);
    const 平均值 = 频率值.reduce((a, b) => a + b, 0) / 频率值.length;
    const 方差 = 频率值.reduce((a, b) => a + Math.pow(b - 平均值, 2), 0) / 频率值.length;
    const 标准差 = Math.sqrt(方差);
    return { 平均值, 标准差 };
}

function 显著性判断(频率, 平均值, 标准差) {
    // 这里我们使用平均值加上两倍标准差作为阈值
    return 频率 > 平均值 + 3 * 标准差;
}
let 已处理组合 = {};
function 处理组合频率并添加新词() {
    const { 平均值, 标准差 } = 计算平均值和标准差(组合频率字典);
    const 组合 = Object.keys(组合频率字典).find(组合 => !已处理组合[组合]); // 获取并标记第一个未处理的键
    const 频率 = 组合频率字典[组合];
    console.log(组合频率字典)

    if (显著性判断(频率, 平均值, 标准差) && Object.keys(组合频率字典).length > 1000) {
        jieba.add_word(组合);
        sac.logger.tokenizerInfo(`学习到新的组合${组合},已经添加到词典中`);
    }
    // 标记已处理的组合
    已处理组合[组合] = true;

    // 如果还有未处理的组合，再次请求空闲回调
    if (Object.keys(组合频率字典).some(组合 => !已处理组合[组合])) {
        setTimeout(处理组合频率并添加新词, 2000);
    } else {
        setTimeout(处理组合频率并添加新词, 4000);
    }
}

// 启动空闲时间处理
setTimeout(处理组合频率并添加新词, 2000);
// 新增函数：从文本中学习新词组
export async function 学习新词组(文本) {
    console.log(文本)
    const 分词结果 = await jieba.tokenize(文本,"search"); // 使用精确模式进行分词
    分词结果.forEach((当前分词, 索引) => {
        if (索引 < 分词结果.length - 1) {
            const 下一个分词 = 分词结果[索引 + 1];
            if (校验分词是否连续(当前分词, 下一个分词)) {
                更新组合频率(当前分词, 下一个分词);
            }
        }
    });
    处理组合频率并添加新词();
}
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
    const blocks = await kernelApi.sql({stmt:query});
    const doc = await kernelApi.getDoc({id:blocks[0].id})
    if (blocks && blocks.length > 0) {
        const $ = cheerio.load(doc.content);
        const textContent = $('body').text();
        console.log(textContent)
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
