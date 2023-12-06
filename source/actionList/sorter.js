import plugin from './runtime.js'
export function 排序动作表(动作表, 当前关键词, 命令历史, 当前上下文) {
    // 字符串相似度算法（Levenshtein距离）权重
    const 文本相似性得分权重 = 0.4;
    // 位置权重算法权重
    const 位置得分权重 = 0.8;
    // 优先级算法权重
    const 优先级得分权重 = 0.2;
    // 历史记录算法权重
    const 历史匹配得分权重 = 0.1;
    // 上下文相关算法权重
    const 上下文相关得分权重 = 0.1;

    const sortAlgorithms = [
        { calculateScore: 计算文本相似性得分, weight: 文本相似性得分权重 },
        { calculateScore: 计算位置得分, weight: 位置得分权重 },
        { calculateScore: 计算优先级得分, weight: 优先级得分权重 },
        { calculateScore: 计算历史匹配得分, weight: 历史匹配得分权重 },
        { calculateScore: 执行上下文匹配得分, weight: 上下文相关得分权重 }
    ];
    // 综合算法排序
    function 以指定算法对命令进行加权排序(命令序列, 算法权重表) {
        return 命令序列.sort((a, b) => {
            let scoreA = 0;
            let scoreB = 0;

            算法权重表.forEach(算法对象 => {
                const { calculateScore: 计算函数, weight: 权重 } = 算法对象;

                let scoreA = 计算函数(a);
                let scoreB = 计算函数(b);

                scoreA += scoreA * 权重;
                scoreB += scoreB * 权重;
            });

            return scoreB - scoreA;
        });
    }
    return 以指定算法对命令进行加权排序(动作表, sortAlgorithms);
}
// 计算相似度得分
function 计算文本相似性得分(command) {
    const distance = 计算Levenshtein距离(当前关键词, command.hints);
    return 1 - distance / Math.max(当前关键词.length, command.hints.length);
}

// 计算位置权重得分
function 计算位置得分(command) {
    const index = command.hints.indexOf(当前关键词);
    return index >= 0 ? 1 - index / command.length : 0;
}

// 计算优先级得分
function 计算优先级得分(command) {
    // 假设每个命令对象有一个priority属性表示优先级
    return command.priority || 0;
}

// 计算历史记录得分
function 计算历史匹配得分(command) {
    const count = 命令历史.filter(cmd => cmd === command).length;
    return count / 命令历史.length;
}

// 计算上下文相关得分
function 执行上下文匹配得分(命令) {
    // 假设每个命令对象有一个context属性表示上下文
    const contextA = (命令.lastContext || '').toString();
    const contextB = 当前上下文.toString();
    const distance = plugin.textProcessor.计算Levenshtein距离(contextA, contextB);
    return 1 - distance / Math.max(contextA.length, contextB.length);
}
