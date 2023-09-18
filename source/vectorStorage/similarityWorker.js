let module = {
}
onmessage =
    (event) => {
        const { 输入点, 点数据集, 相似度算法 } = event.data
        let scores = module.计算相似度(输入点, 点数据集, module[相似度算法])
        postMessage(scores)
        close()
    }
