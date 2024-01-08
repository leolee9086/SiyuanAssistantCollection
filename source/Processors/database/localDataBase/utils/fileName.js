export const 数据集文件夹名非法字符校验正则 = /[\/\\:?%*"|<> ]+/g;
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const character = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + character;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }
  
  export function 迁移为合法文件夹名称(原始名称) {
    if(!数据集文件夹名非法字符校验正则.test(原始名称)){
      return 原始名称
    }
    // 移除不允许的字符并替换为下划线
    const 清理后的名称 = 原始名称.replace(数据集文件夹名非法字符校验正则, '_');
    // 移除连续的下划线
    const 无连续下划线的名称 = 清理后的名称.replace(/_+/g, '_');
    // 移除首尾的下划线
    const 去首尾下划线的名称 = 无连续下划线的名称.replace(/^_+|_+$/g, '');
    // 生成哈希码
    const 哈希码 = hashCode(原始名称).toString(16);
    // 对可读部分进行截断以确保名称不会过长
    const 可读部分 = 去首尾下划线的名称.length > 64
     ? 去首尾下划线的名称.substring(0, 64) : 去首尾下划线的名称;
    // 将哈希码附加到文件夹名称
    const 最终名称 = `${可读部分}_${哈希码}`;
    return 最终名称;
  }