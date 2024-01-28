import { 块数据集名称 } from "./name.js";

import { 获取数据集所有主键 } from "../../database/publicUtils/endpoints.js";

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

export const 获取并处理数据集所有主键 = async () => {
    let id数组查询结果 = await 获取数据集所有主键(块数据集名称);
    let 已入库块哈希映射 = id数组查询结果.body.data;
    return 已入库块哈希映射;
};

