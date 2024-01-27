// 如果特征向量名称数组中还没有这个模型名称，则添加进去
// 假设有一个方法用于初始化特征向量的hnsw层级

let 计算次数=0
let 正确次数=0

async function 测试数据项查询速度(数据项, 数据集, hnsw层级映射) {
    for (let 模型名称 in 数据项.vector) {
        try {
            if (Object.keys(数据集).length < 1000) {
                continue;
            }
            console.log(`当前数据集大小${Object.keys(数据集).length}`);
            let hnsw查询结果 = withPerformanceLogging(hnswAnn搜索数据集)(数据集, 模型名称, 数据项.vector[模型名称], 100, hnsw层级映射);
            let 暴力查询 = withPerformanceLogging(准备向量查询函数)(数据集);
            let 暴力查询结果 = await withPerformanceLogging(暴力查询)(模型名称, 数据项.vector[模型名称], 100);

            // 计算不同K值的召回率
            const K值列表 = [100, 50, 20, 10];
            K值列表.forEach(K值 => {
                let hnswIds = new Set(hnsw查询结果.slice(0, K值).map(r => r.id));
                let 暴力查询Ids = new Set(暴力查询结果.slice(0, K值).map(r => r.id));
                let 交集数量 = [...hnswIds].filter(id => 暴力查询Ids.has(id)).length;
                let 召回率 = 交集数量 / K值; // 召回率是交集数量除以K值
                console.log(`K${K值}的hnswAnn搜索召回率: ${召回率.toFixed(4)}`); // 保留四位小数
            });
            计算次数 += 1
            if (hnsw查询结果[0].id === 暴力查询结果[0].id) {
                正确次数 += 1
                console.log(`k1的多次命中召回率: ${(正确次数 / 计算次数).toFixed(4)}`); // 保留四位小数

            }
            // 显示前一百项的id和分数
            //console.log('hnsw查询结果前100项:', hnsw查询结果.slice(0, 100).map(r => `${r.id}: ${r.score}`));
            //console.log('暴力查询结果前100项:', 暴力查询结果.slice(0, 100).map(r => `${r.id}: ${r.similarityScore}`));
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}