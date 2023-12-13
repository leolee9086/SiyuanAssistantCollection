export function 校验主键(主键值){
    return /^\d{14}$/.test(主键值.substring(0, 14));
}