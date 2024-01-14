
export function 将向量单位化(输入向量) {
    let 平方和 = 输入向量.reduce((acc, cur) => acc + cur * cur, 0);
    let 长度 = Math.sqrt(平方和);
    let 单位化向量 = 输入向量.map(value => value / 长度);
    return 单位化向量;
}
export function 计算加权平均向量(向量组, 权重组, 是否单位化结果) {
    let 总向量 = [];
    for (let i = 0; i < 向量组[0].length; i++) {
        let sum = 0;
        for (let j = 0; j < 向量组.length; j++) {
            //计权相加
            sum += 向量组[j][i] * 权重组[j];
        }
        总向量.push(sum);
    }
    let 加权平均向量 = 总向量.map((value, index) => value / 向量组.length);
    if (是否单位化结果) {
        let 单位化向量 = 将向量单位化(加权平均向量);
        return 单位化向量;
    } else {
        return 加权平均向量;
    }
}

