/**
 * 将函数序列化为字符串
 * @param {Function} func - 需要序列化的函数
 * @returns {string} - 序列化后的函数字符串
 * @throws {Error} - 如果输入的不是函数，抛出错误
 */
function serialize(func) {
    if (typeof func !== 'function') {
        throw new Error('参数必须是一个函数');
    }
    // 使用 Function.prototype.toString 方法将函数转换为字符串
    return func.toString();
}

/**
 * 将字符串反序列化为函数
 * @param {string} funcString - 需要反序列化的函数字符串
 * @returns {Function} - 反序列化后的函数
 * @throws {Error} - 如果输入的不是字符串，或者字符串不能被解析为函数，抛出错误
 */
function deserialize(funcString) {
    if (typeof funcString !== 'string') {
        throw new Error('参数必须是一个字符串');
    }
    // 使用正则表达式从字符串中提取函数的参数和函数体
    const arrowFunc = funcString.match(/^(?:async\s)?\((.*?)\)\s=>\s(.*)$/s);
    const normalFunc = /function\s.*?\(([^)]*)\)[^\{]*\{([\s\S]*)\}$/.exec(funcString);
    let funcArgs;
    let funcBody;
    if (arrowFunc) {
        funcArgs = arrowFunc[1];
        funcBody = arrowFunc[2];
    } else if (normalFunc) {
        funcArgs = normalFunc[1];
        funcBody = normalFunc[2];
    } else {
        throw new Error('无法解析函数字符串');
    }
    // 使用 eval 函数来创建一个新的函数，这样可以保留函数的作用域链
    // 注意：eval 函数有安全风险，只有在你完全信任 funcString 的情况下才能使用
    return eval('(' + funcString + ')');
}



async function 为任务生成代码(输入,目标,code=''){
    try{
        code = ai.生成代码(输入,目标)
        eval(code)
    }catch(e){
        console.error('执行错误',e)
        let 分析结果= await ai.分析错误(输入,目标,code,e)
        code = await ai.生成代码(输入,目标,code,分析结果)
    }
}

function 判定目标(target, input, output, generatedFunction) {
    const prompt = `目标: ${target}\n代码:${generatedFunction}\n输入: ${JSON.stringify(input)}\n输出: ${JSON.stringify(output)}`;

    // 让 AI 判断目标是否已经达成
    const result = ai.判断(prompt);

    // 如果 AI 判断目标已经达成，返回0
    if (result === 0) {
        return 0;
    }

    // 如果 AI 判断目标还未达成，返回改进后的代码
    const improvedCode = ai.改进代码(prompt);
    return improvedCode;
}



/**
 * 根据目标生成系统提示词
 * @param {string} domain - AI的领域，例如"医学"、"编程"等
 * @param {string} judgmentBasis - AI判断的依据，例如"根据输入和输出判断"等
 * @param {string} inputExample - 输入的示例，例如"{\"age\": 30, \"gender\": \"male\"}"
 * @param {Object} outputFormat - 输出的格式，包含成功结果和失败结果，例如{ "successResult": "Success", "failureResult": "Failure" }
 * @returns {string} - 生成的系统提示词
 * @throws {Error} - 如果输入的参数不满足要求，抛出错误
 * 
 * 注意：这个函数已经处理了可能出现的错误，例如，如果输出格式没有成功结果或失败结果，这个函数会抛出错误。
 * 同时，这个函数也处理了模板字符串中可能出现的特殊字符问题，使用了 escape 函数来转义特殊字符。
 */
let generateSystemPromptBasedOnTarget = (domain, judgmentBasis, inputExample, outputFormat) => {
    // 参数验证
    // 如果参数类型不正确，抛出错误
    if (typeof domain !== 'string' || typeof judgmentBasis !== 'string' || typeof inputExample !== 'string' || typeof outputFormat !== 'object') {
        throw new Error('参数类型必须正确');
    }
    // 如果输出格式没有成功结果或失败结果，抛出错误
    if (!outputFormat.successResult || !outputFormat.failureResult) {
        throw new Error('输出格式必须包含成功结果和失败结果');
    }

    // 生成系统提示词
    // 注意：这里使用了模板字符串，如果输入的参数包含特殊字符，可能会导致生成的提示词格式错误。

    return `
    You are an expert in ${domain}, and your task is to judge whether the solution has correctly implemented the target based on the given target, input, output, and solution.
    If you think the solution can achieve the target, you should return ${outputFormat.successResult}.
    If you think the solution cannot achieve the target, you should return ${outputFormat.failureResult} and your opinion.
    Your judgment should be based on the following judgment basis: ${judgmentBasis}, and your deep understanding of ${escape(domain)}.
    When you receive the following format content composed of target, input, output, and solution, you need to give an accurate judgment according to the requirements:
    ${inputExample}
    If there are errors in the solution, you need to identify and handle these errors, and then return the improved solution.
    According to the above requirements for judgment, you should always return and only return a json object with the following structure, where the part of <> is filled in your judgment
    {
        "Judgment":<Judgment result>,
        "Improved solution":<Improved solution>,
        "Basis and opinion for improvement":<Your basis and opinion>
    }
    `;
}
async function 判断(prompt,系统提示词){
    let message = {role:'user',content:prompt}
    let systemPrompt = 系统提示词
    let sys = {role:'system',content:systemPrompt}
    return await ai.reply([sys,message])
}
