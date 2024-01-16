export const 构建块向量数据项 = (块数据, 向量键名, 向量值) => ({
    id: 块数据.id,
    meta: {
        link: `siyuan://blocks/${块数据.id}`,
        box: 块数据.box,
        hash: 块数据.hash
    },
    vector: {
        [向量键名]: 向量值
    }
});
