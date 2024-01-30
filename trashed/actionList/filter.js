import { 动作总表 } from "./index.js";
// Utility to check for an aborted signal
function checkIfAborted(signal) {
    return signal && signal.aborted;
}

// Generic sorting function
function sortByComputedValues(array, computeValue) {
    return array.sort((a, b) => (computeValue(a) || 0) - (computeValue(b) || 0));
}

// Generic function to execute a function and measure its execution time
async function executeWithTiming(fn, ...args) {
    let startTime = Date.now();
    let result = await fn(...args);
    let endTime = Date.now();
    return { result, timeTaken: endTime - startTime };
}

// Generic error logging function
function logError(logger, error, context) {
    logger.actionListwarn(error, context);
}

// The refactored function using the utilities
export async function 根据上下文获取动作表(context, signal) {
    let 备选动作表 = [];
    if (checkIfAborted(signal)) {
        return 备选动作表;
    }

    动作总表 = sortByComputedValues(动作总表, 动作 => 动作表耗时[动作]);

    for (let 动作表 of 动作总表) {
        if (checkIfAborted(signal)) {
            return [];
        }
        try {
            let { timeTaken } = await executeWithTiming(处理动作表, 动作表, 备选动作表, context, signal);
            动作表耗时[动作表] = timeTaken;
        } catch (e) {
            logError(logger, e, 动作表);
        }
    }

    console.log(备选动作表);
    return 备选动作表;
}