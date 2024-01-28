export const 构建块向量数据项 = (块数据, 向量键名, 向量值) => ({
    //id实际上在入库的时候也可以生成,但是因为是块向量,所以直接指定为块的id
    id: 块数据.id,
    //这个是元数据
    meta: {
        link: `siyuan://blocks/${块数据.id}`,
        box: 块数据.box,
        hash: 块数据.hash
    },
    vector: {
        [向量键名]: 向量值
    }
});
