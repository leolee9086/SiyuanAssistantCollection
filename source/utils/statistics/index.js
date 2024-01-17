export function 计算平均值和标准差(频率字典) {
    const 频率值 = Object.values(频率字典);
    const 平均值 = 频率值.reduce((a, b) => a + b, 0) / 频率值.length;
    const 方差 = 频率值.reduce((a, b) => a + Math.pow(b - 平均值, 2), 0) / 频率值.length;
    const 标准差 = Math.sqrt(方差);
    return { 平均值, 标准差 };
}

