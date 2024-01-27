import { jieba } from '../runtime.js'
import { kernelApi } from '../runtime.js'
// 假设这是一个全局变量，用于跟踪每个单词的出现次数
let wordOccurrences = new Map();
export const 更新单词出现次数 = (blocks, 最大缓存大小 = 5000) => {
    // 统计每个单词在所有块中出现的次数
    blocks.forEach(block => {
        let blockTokens = jieba.tokenize(block.content, "search");
        blockTokens.forEach(token => {
            if (token.word.length >= 2) {
                wordOccurrences.set(token.word, (wordOccurrences.get(token.word) || 0) + 1);
            }
        });
    });
    // 如果缓存过大，则直接清空缓存
    if (wordOccurrences.size > 最大缓存大小) {
        wordOccurrences.clear();
    }
};
export const 创建搜索语句 = (tokens) => {
    let uniqueTokens = [];
    tokens.forEach(token => {
        wordOccurrences.set(token.word, (wordOccurrences.get(token.word) || 0) + 1);
        if (token.word.length >= 2 && (!wordOccurrences.has(token.word) || wordOccurrences.get(token.word) <= 50)) {
            uniqueTokens.push(token.word);
        }
    });
    // 首先根据单词出现次数进行排序，出现次数少的在前,这是为了提高tips的新鲜度
    uniqueTokens.sort((a, b) => {
        let countA = wordOccurrences.get(a) || 0;
        let countB = wordOccurrences.get(b) || 0;
        return countA - countB;
    });
    // 然后根据单词长度进行排序，长度长的在前
    uniqueTokens.sort((a, b) => b.length - a.length);
    let query = uniqueTokens.slice(0,3).join('" OR "');
    if (query) {
        query = `"${query}"`;
    }
    return query;
};

export const 根据共同词素数量对块进行排序 = (blocks, tokens, 标题和文档包含全部内容 = false) => {
    let tokenWords = new Set(tokens.map(token => token.word));
    blocks.forEach(block => {
        let blockTokens = jieba.tokenize(block.content, "search")
        block.commonTokensCount = blockTokens.reduce((count, token) => {
            if (tokenWords.has(token.word)) {
                let additionalCount = [...token.word].reduce((acc, char) => {
                    return acc + (char.match(/[\u4e00-\u9fa5]/) ? 2 : 1);
                }, 0);
                return count + additionalCount;
            }
            return count;
        }, 0);
        if (标题和文档包含全部内容
            && (block.type === 'd' || block.type === 'h')
        ) {
            // let content = Lute.New().BlockDOM2Text(kernelApi.getDoc.sync({ id: block.id, size: 102400 }).content)
            let content = kernelApi.getDoc.sync({ id: block.id, size: 3 }).content
            block.content = content
            return block
        }
    })
    blocks = blocks.filter(block => { return block.commonTokensCount })
    // 根据共同词素数量对块进行排序
    blocks.sort((a, b) => b.commonTokensCount - a.commonTokensCount)
    return blocks
}
export const seachBlockWithText = async (text, options = { 使用原始结果: false, 结果数量: 10, 标题和文档包含全部内容: false }) => {
    let 分词结果 = jieba.tokenize(text, "search")
    let { 结果数量, 标题和文档包含全部内容, 使用原始结果 } = options
    // 然后执行搜索
    // 假设 `tokens` 是你的搜索词汇数组
    let searchQuery = 创建搜索语句(分词结果);
    let data = await kernelApi.fullTextSearchBlock({
        "query": searchQuery,
        "method": 1,
        "types": { "document": false, "heading": true, "list": false, "listItem": false, "codeBlock": true, "htmlBlock": true, "mathBlock": true, "table": true, "blockquote": true, "superBlock": true, "paragraph": true, "embedBlock": false },
        "paths": [],
        "groupBy": 0,
        "orderBy": 0,
        "page": 1
    })
    if (data && data.blocks[0]) {
        // 计算每个块与查询文本的共同词素数量
        // 返回共同词素数量最多的十个块
        // 使用类似rss的方式渲染以保持调用形式统一
        let blocks = 根据共同词素数量对块进行排序(data.blocks, 分词结果, 标题和文档包含全部内容)
        // 在执行搜索之前，首先更新单词出现次数
        // 假设 `blocks` 是你要搜索的所有块的数组
        更新单词出现次数(blocks);
        let res = blocks.slice(0, 结果数量)
        if (使用原始结果) {
            return res
        } else return {
            title: "块搜索结果",
            description: "使用分词结果搜索的块结果",
            item: res.map(
                block => {
                    return {
                        title: "文本搜索块",
                        description: block.content,
                        link: `siyuan://blocks/${block.id}`,
                        block: block,
                        source: 'localBlockText',
                        textScore: block.commonTokensCount,
                        id: block.id
                    }
                }
            )
        }
    }
    else return []
}
