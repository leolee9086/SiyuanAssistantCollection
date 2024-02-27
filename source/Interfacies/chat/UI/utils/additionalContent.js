export function 提取附加信息(回复文字内容) {
    // 正则表达式用于匹配附加内容的开始和结束
    const 附加信息正则 = /\`\`\`AIMessageAttach\n([\s\S]*?)\n\`\`\`/;
    const match = 回复文字内容.match(附加信息正则);
    if (match && match[1]) {
        try {
            // 尝试将匹配到的字符串转换为JSON对象
            return JSON.parse(match[1]);
        } catch (e) {
            console.error("解析附加内容的JSON时出错:", e);
            return null;
        }
    } else {
        console.log("没有找到附加内容");
        return null;
    }
}
