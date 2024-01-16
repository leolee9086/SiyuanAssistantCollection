// 更新任务平均执行时间的纯函数
function 更新任务平均执行时间(任务平均执行时间, 当前任务索引, 实际执行时间) {
    const 新的任务平均执行时间 = [...任务平均执行时间];
    新的任务平均执行时间[当前任务索引] = (任务平均执行时间[当前任务索引] + 实际执行时间) / 2;
    return 新的任务平均执行时间;
}
// 执行任务并返回实际执行时间的纯函数
function 执行任务并计算执行时间(任务) {
    const 开始时间 = performance.now();
    任务();
    const 结束时间 = performance.now();
    return 结束时间 - 开始时间;
}
// 主函数，使用纯函数处理任务
export function 在空闲时间执行任务(任务数组) {
    let 当前任务索引 = 0;
    let 任务平均执行时间 = 任务数组.map(() => 0);
    const 执行下一步 = (截止时间) => {
        while (当前任务索引 < 任务数组.length && 截止时间.timeRemaining() > 0) {
            const 剩余时间 = 截止时间.timeRemaining();
            const 预估执行时间 = 任务平均执行时间[当前任务索引];
            if (预估执行时间 > 剩余时间) {
                console.warn(`任务 ${当前任务索引} 的预估执行时间过长，已被跳过。`);
                当前任务索引++;
                continue;
            }
            try {
                const 任务 = 任务数组[当前任务索引];
                const 实际执行时间 = 执行任务并计算执行时间(任务);
                任务平均执行时间 = 更新任务平均执行时间(任务平均执行时间, 当前任务索引, 实际执行时间);
                当前任务索引++;
            } catch (错误) {
                console.error(`执行任务 ${当前任务索引} 时出错:`, 错误);
                当前任务索引++;
            }
        }
        if (当前任务索引 < 任务数组.length) {
            requestIdleCallback(执行下一步,{timeout:1000});
        }
    };
    requestIdleCallback(执行下一步,{timeout:1000});
}


// source/utils/functionAndClass/idleTime.js
export function 创建空闲时间函数序列(函数数组) {
    return function() {
        let 结果;
        let 当前函数索引 = 0;

        const 执行下一步 = (截止时间) => {
            while ((截止时间.timeRemaining() > 0 || 截止时间.didTimeout) && 当前函数索引 < 函数数组.length) {
                try {
                    结果 = 函数数组[当前函数索引](结果);
                } catch (错误) {
                    console.error(`执行函数 ${当前函数索引} 时出错:`, 错误);
                }
                当前函数索引++;
            }
            if (当前函数索引 < 函数数组.length) {
                requestIdleCallback(执行下一步);
            }
        };

        requestIdleCallback(执行下一步);
    };
}