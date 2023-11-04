async function fetchRobotsTxt(url) {
    // 构造robots.txt的URL
    const robotsUrl = new URL('/robots.txt', url);

    try {
        // 发送请求
        const response = await fetch(robotsUrl);

        // 检查响应状态
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 读取响应的文本内容
        const text = await response.text();
        console.log(text)
        // 解析文本内容为JSON
        const json = text.split('\n').reduce((result, line) => {
            const [key, value] = line.split(':').map(s => s.trim());
            if (key === 'User-agent') {
                result[value] = {};
            } else if (key === 'Disallow' || key === 'Allow') {
                if (result[value] === undefined) {
                    result[value] = [];
                }
                result[value].push(value);
            }
            return result;
        }, {});

        return json;
    } catch (error) {
        console.error(`Failed to fetch '${robotsUrl}': ${error}`);
        return null;
    }
}

// 使用示例：
fetchRobotsTxt('https://www.baidu.com/').then(robotsTxt => {
    console.log(robotsTxt);
});
fetchRobotsTxt('https://www.google.com/').then(robotsTxt => {
    console.log(robotsTxt);
});