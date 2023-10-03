export function isValidJSON(obj) {
    try {
        // 将对象转换为JSON字符串
        let json = JSON.stringify(obj);

        // 将JSON字符串转换回对象
        let parsed = JSON.parse(json);

        // 检查转换回来的对象是否与原始对象"按原样"相等
        return JSON.stringify(obj) === JSON.stringify(parsed);
    } catch (e) {
        // 如果转换过程中抛出错误，说明对象不能在JSON中"按原样"存储
        return false;
    }
}
function safeEval(code, context) {
    // 创建一个空的上下文对象
    let safeContext = {};
    // 将context对象中的属性和方法复制到safeContext对象中
    for (let key in context) {
        if (context.hasOwnProperty(key)) {
            safeContext[key] = context[key];
        }
    }
    // 使用safeContext对象作为执行环境
    return new Function('context', 'with (context) { return ' + code + ' }')(safeContext);
}
function isValidCssVar(value) {
    return typeof value === 'object' && value !== null &&
        '$value' in value && '$type' in value && value.$type === 'color';
}

function isValidUserValidation(value) {
    return typeof value === 'object' && value !== null &&
        '$value' in value && '$type' in value && value.$type === 'string' &&
        '$validator' in value && typeof value.$validator === 'string';
}

function isValidShortcut(value) {
    return typeof value === 'object' && value !== null &&
        '$value' in value && '$type' in value && value.$type === 'string';
}

function isValidAvatar(value) {
    return typeof value === 'object' && value !== null &&
        '$value' in value && '$type' in value && value.$type === 'file';
}

function isValidPhone(value) {
    return typeof value === 'object' && value !== null &&
        '$value' in value && '$type' in value && value.$type === 'string' &&
        '$validator' in value && typeof value.$validator === 'string';
}

function isValidDateRange(value) {
    return typeof value === 'object' && value !== null &&
        '$value' in value && '$type' in value && value.$type === 'date-range' &&
        Array.isArray(value.$value) && value.$value.length === 2;
}

function isValidPercentage(value) {
    return typeof value === 'object' && value !== null &&
        '$value' in value && '$type' in value && value.$type === 'percentage' &&
        typeof value.$value === 'number';
}

function isValidTime(value) {
    return typeof value === 'object' && value !== null &&
        '$value' in value && '$type' in value && value.$type === 'time';
}

function isValidNumberRange(value) {
    return typeof value === 'object' && value !== null &&
        '$value' in value && '$type' in value && (value.$type === 'number' || value.$type === 'int') &&
        'range' in value && typeof value.range === 'string';
}

function isValidLocation(value) {
    return typeof value === 'object' && value !== null &&
        '$value' in value && '$type' in value && value.$type === 'location';
}

function isValidPassword(value) {
    return typeof value === 'object' && value !== null &&
        '$value' in value && '$type' in value && value.$type === 'password';
}

function isValidZipCode(value) {
    return typeof value === 'object' && value !== null &&
        '$value' in value && '$type' in value && value.$type === 'string' &&
        '$validator' in value && typeof value.$validator === 'string';
}

function isValidCountry(value) {
    return typeof value === 'object' && value !== null &&
        '$value' in value && '$type' in value && value.$type === 'select' &&
        '$options' in value && Array.isArray(value.$options);
}

function isValidRegexText(value) {
    return typeof value === 'object' && value !== null &&
        '$value' in value && '$type' in value && value.$type === 'string' &&
        'regex' in value && typeof value.regex === 'string';
}
function isValidBasicType(value) {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
}

function isValidOptions(value) {
    return Array.isArray(value.$options) && value.$options.every(option => typeof option === 'string') && isValidSetting(value.$value);
}

function isValidValidator(value) {
    let validator = safeEval(value.$validator, {});
    return (isValidBasicType(value.$value) || typeof value.$value === 'object') && validator(value.$value);
}

function isValidI18n(value, keys, supportedLanguages) {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    let i18nKeys = Object.keys(value);
    for (let i18nKey of i18nKeys) {
        if (!keys.includes(i18nKey) || typeof value[i18nKey] !== 'object') {
            return false;
        }
        let localizationKeys = Object.keys(value[i18nKey]);
        for (let localizationKey of localizationKeys) {
            if (!supportedLanguages.includes(localizationKey) || typeof value[i18nKey][localizationKey] !== 'string') {
                return false;
            }
        }
    }
    return true;
}

export function isValidSetting(value) {
    let stack = [{ value: value, depth: 0 }];
    let supportedLanguages = ['zh_CN', 'en_US']; // @TODO添加其他支持的语言代码
    while (stack.length > 0) {
        let { value, depth } = stack.pop();
        if (depth > 100) { // 限制深度为100
            return false;
        }
        if (isValidBasicType(value)) {
            continue;
        } else if (Array.isArray(value)) {
            return false;
        } else if (typeof value === 'object' && value !== null) {
            if ('$options' in value && '$value' in value) {
                if (!isValidOptions(value)) {
                    return false;
                }
            } else if ('$value' in value && '$validator' in value && typeof value.$validator === 'string') {
                if (!isValidValidator(value)) {
                    return false;
                }
            } else {
                let keys = Object.keys(value);
                for (let key of keys) {
                    if (key.startsWith('$')) {
                        if (key !== '$options' && key !== '$value' && key !== '$validator' && key !== '$i18n') {
                            return false;
                        }
                        if (key === '$i18n' && !isValidI18n(value[key], keys, supportedLanguages)) {
                            return false;
                        }
                    } else {
                        stack.push({ value: value[key], depth: depth + 1 });
                    }
                }
            }
        } else {
            return false;
        }
    }
    return true;
}
function _isValidSetting(value) {
    let stack = [{ value: value, depth: 0 }];
    let supportedLanguages = ['zh_CN', 'en_US']; // @TODO添加其他支持的语言代码
    while (stack.length > 0) {
        let { value, depth } = stack.pop();
        if (depth > 100) { // 限制深度为100
            return false;
        }
        if (typeof value === 'object' && value !== null) {
            if ('$type' in value) {
                if (!isValidType(value.$value, value.$type)) {
                    return false;
                }
            } else if ('$options' in value && '$value' in value) {
                if (!isValidOptions(value)) {
                    return false;
                }
            } else if ('$value' in value && '$validator' in value && typeof value.$validator === 'string') {
                if (!isValidValidator(value)) {
                    return false;
                }
            } else {
                let keys = Object.keys(value);
                for (let key of keys) {
                    if (key.startsWith('$')) {
                        if (key !== '$options' && key !== '$value' && key !== '$validator' && key !== '$i18n' && key !== '$type') {
                            return false;
                        }
                        if (key === '$i18n' && !isValidI18n(value[key], keys, supportedLanguages)) {
                            return false;
                        }
                    } else {
                        stack.push({ value: value[key], depth: depth + 1 });
                    }
                }
            }
        } else if (isValidBasicType(value)) {
            continue;
        } else {
            return false;
        }
    }
    return true;
}
function isValidType(value, type) {
    switch (type) {
        case 'string':
        case 'number':
        case 'boolean':
            return typeof value === type;
        case 'color':
            return isValidColor(value);
        case 'dateString':
            return isValidDateString(value);
        // 添加其他类型的处理逻辑
        default:
            return false;
    }
}
let 设置 = {
    日志设置: {
        aiChat: false,
        aiShell: false,
        dataSet: false,
        MAGI: false,
        event: false,
    },
    向量工具设置: {
        默认文本向量化模型: 'leolee9086/text2vec-base-chinese',
        最大句子长度: 496,
    },
    聊天工具设置: {
        默认AI: "paimon",
        决策级别: 0,
        //在超过这个长度之后,聊天将被总结
        默认聊天短期记忆: 7,
        自动给出参考: 1,
        自动发送当前文档: false,
        自动发送当前搜索结果: false,
        默认参考数量: 10,
        参考文字最大长度: 36,
        基础模型接口: 'OPENAI',
        模型设置: {
            讯飞星火: {
                appid: "",
                api_key: "",
                api_secret: "",
                Spark_url: "",
                domain: "",
            },
            RWKV: {
                apiBaseURL: "",
                apiKey: "",
                apiMaxTokens: 0,
                apiModel: "",
                apiProxy: "",
                apiTimeout: 60,
            },
            ChatGPT: {
                apiBaseURL: "",
                apiKey: "",
                apiMaxTokens: 0,
                apiModel: "",
                apiProxy: "",
                apiTimeout: 60,
            },
        }
    },
    块标动作设置: {
    },
    关键词动作设置: {
    }
}
console.error(_isValidSetting(设置))


