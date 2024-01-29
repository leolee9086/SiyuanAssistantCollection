import fs from "../../../polyfills/fs.js";
import { withPerformanceLogging } from "../../../utils/functionAndClass/performanceRun.js";
import { kernelApi } from "../runtime.js"
const hashCache = {}
const _seachBlockWithVector = async (blocks, 标题和文档包含全部内容, 使用原始结果, 得分阈值, 参考分数较高时给出文档全文) => {
    blocks = blocks.filter(item => item.meta && item.similarityScore > 得分阈值);
    // 获取所有块的ID
    const unCachedIds = blocks.map(
        item => !hashCache[item.meta.hash] ? `"${item.id}"` : null
    ).filter(
        item => item
    )
    // 一次性查询所有块的meta数据
    //const metas =await withPerformanceLogging(kernelApi.sql)({ stmt: `SELECT * FROM blocks WHERE id IN (${unCachedIds.join(',')})` });
    let metas = []
    if (unCachedIds.length) {
        metas = await withPerformanceLogging(kernelApi.sql)({
            stmt: `SELECT * FROM blocks WHERE ${unCachedIds.map(id => `id = ${id}`).join(' OR ')}`
        });
    }
    // 创建一个ID到meta的映射
    const metaMap = metas.reduce((map, meta) => {
        map[meta.id] = meta;
        if (!hashCache[meta.hash]) {
            hashCache[meta.hash] = meta
        }
        return map;
    }, {});

    // 使用映射更新块的meta数据
    blocks = blocks.map(item => {
        if (!metaMap[item.id] && !hashCache[item.meta.hash]) {
            return
        }
        let block = structuredClone(metaMap[item.id]) || structuredClone(hashCache[item.meta.hash])
        if (!block) {
            return undefined
        }
        try {
            if (标题和文档包含全部内容 && (block.type === 'd' || block.type === 'h')) {
                let content = kernelApi.getDoc.sync({ id: item.id, size: 3 }).content;
                block.content = content;
                block.similarityScore = item.similarityScore;
            } else {
                block.similarityScore = item.similarityScore;
            }
            return block;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }).filter(
        item => {
            return item
        }
    )

    blocks = blocks.reduce((uniqueBlocks, currentBlock) => {
        if (uniqueBlocks[currentBlock.id]) {
            // 如果已经存在相同ID的块，比较内容长度，保留内容更长的块
            if (currentBlock.content.length > uniqueBlocks[currentBlock.id].content.length) {
                uniqueBlocks[currentBlock.id] = currentBlock;
            }
        } else {
            // 如果不存在相同ID的块，添加到结果中
            uniqueBlocks[currentBlock.id] = currentBlock;
        }
        return uniqueBlocks;
    }, {});
    // 将对象转换为数组并返回
    let res = Object.values(blocks);
    if (使用原始结果) {
        return res
    } else return {
        title: "块搜索结果",
        description: "使用向量搜索的块结果",
        item: res.map(
            block => {
                return {
                    title: "向量搜索块",
                    description: block.content,
                    link: `siyuan://blocks/${block.id}`,
                    block: block,
                    source: 'localBlockVector',
                    vectorScore: block.similarityScore,
                    id: block.id

                }
            }
        )
    }
}
export const seachBlockWithVector = withPerformanceLogging(_seachBlockWithVector)