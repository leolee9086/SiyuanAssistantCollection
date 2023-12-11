export const seachBlockWithVector = async (vector) => {
    let blocks = await seachWithVector('vector', vector, plugin.configurer.get('聊天工具设置', '默认参考数量').$value || 30)
    //  return blocks.map(item => { return item.meta&&item.score>0.8}).filter(item=>{return item})
    blocks = blocks.filter(item => { return item.meta && item.similarityScore > 0.5 }).map(
        item => {
            try {
                if (plugin.configurer.get('聊天工具设置', '发送参考时文档和标题块发送全部内容').$value && item.meta.type === 'd' || item.meta.type === 'h') {
                    let block = JSON.parse(JSON.stringify(item.meta))
                    let content = plugin.lute.BlockDOM2Text(kernelApi.getDoc.sync({ id: item.id, size: 102400 }).content)
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
                logger.searcherror(e)
                return undefined
            }
        }
    )
    let docs = []
    blocks.forEach(
        block => {
            if (block.similarityScore > 0.8) {
                if (plugin.configurer.get('聊天工具设置', '参考分数较高时给出文档全文').$value) {
                    let root = block.root
                    let rootContent = plugin.lute.BlockDOM2Text(kernelApi.getDoc.sync({ id: block.id, size: 102400 }).content)
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
    return Object.values(blocks);
}
