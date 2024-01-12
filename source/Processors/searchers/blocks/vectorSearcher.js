import { kernelApi } from "../runtime.js"
export const seachBlockWithVector = async (blocks,标题和文档包含全部内容,使用原始结果,得分阈值,参考分数较高时给出文档全文) => {
    blocks = blocks.filter(item => { return item.meta && item.similarityScore > 得分阈值 }).map(
        item => {
            item.meta = kernelApi.sql.sync({ stmt: `select * from blocks where id ="${item.id}"` })[0]
            try {
                if (标题和文档包含全部内容 && item.meta.type === 'd' || item.meta.type === 'h') {
                    let block = JSON.parse(JSON.stringify(item.meta))
                    let content = kernelApi.getDoc.sync({ id: item.id, size: 3 }).content
                    block.content = content
                    block.similarityScore = item.similarityScore
                    return block
                }
                else {
                    let block = JSON.parse(JSON.stringify(item.meta))
                    block.similarityScore = item.similarityScore
                    return block
                }
            } catch (e) {
                console.error(e)
                return undefined
            }
        }
    )
    let docs = []
    blocks.forEach(
        block => {
            if (block.similarityScore > 0.8) {
                if (参考分数较高时给出文档全文) {
                    let root = block.root
                    let rootContent = kernelApi.getDoc.sync({ id: block.id, size: 3 }).content
                    let rootInfo = kernelApi.sql.sync({ stmt: `select * from blocks where id ="${root}"` })
                    rootInfo.similarityScore = block.similarityScore
                    rootInfo.content = rootContent
                    docs.push(rootInfo)
                }
            }
        }
    )
    blocks = blocks.concat(docs)
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
    let res= Object.values(blocks);
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
                    block:block,
                    source:'localBlockVector',
                    vectorScore:block.similarityScore,
                    id:block.id

                }
            }
        )
    }
}
