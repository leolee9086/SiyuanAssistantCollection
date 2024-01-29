/**
 * 计算字符串的哈希值。
 * 使用DJBX33A（也称为Dan Bernstein's Times 33 with Addition）哈希算法。
 * @param {string} 输入字符串 - 需要计算哈希值的字符串。
 * @returns {number} 返回字符串的哈希值，是一个32位整数。
 */
function 计算字符串数字哈希(输入字符串) {
    // 初始化哈希值为0
    let 数字哈希 = 0;
    // 遍历输入字符串的每个字符
    for (let i = 0; i < 输入字符串.length; i++) {
        // 获取字符的Unicode编码
        let 字符编码 = 输入字符串.charCodeAt(i);
        // 使用DJBX33A哈希算法计算哈希值
        数字哈希 = ((数字哈希 << 5) - 数字哈希) + 字符编码;
        // 将哈希值转换为32位整数
        数字哈希 = 数字哈希 & 数字哈希;
    }
    // 返回哈希值
    return 数字哈希;
}