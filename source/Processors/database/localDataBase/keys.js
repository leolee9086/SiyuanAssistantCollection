export function 校验主键(主键值){
    return /^\d{14}$/.test(主键值.substring(0, 14));
}
export function 从数据集获取数据项(数据集,主键值){
    return 数据集[主键值]
}