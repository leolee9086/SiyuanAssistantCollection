export const qwenChatCompletions = async (prompt, api_key, modelName) => {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`
    };
    const body = {
        model: modelName,
        input: {
            messages: preparePromptForQwen(prompt),
        },
        parameters: {
        }
    };
    const baseURL = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
    let response = await fetch(baseURL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body)
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    let openAIFormat=convertQwenToOpenAIFormat(data,modelName)
    return openAIFormat;
}

function preparePromptForQwen(prompt) {
    // 确保system提示词位于最开始，且user和assistant交替出现
    let adjustedPrompt = [];
    let lastRole = '';

    prompt.forEach((message, index) => {
        if (index === 0 && message.role === 'system') {
            // 确保第一条消息为system，如果是，则添加到调整后的prompt中
            adjustedPrompt.push(message);
        } else if (message.role === 'user' || message.role === 'assistant') {
            if (message.role !== lastRole) {
                // 确保user和assistant交替出现
                adjustedPrompt.push(message);
                lastRole = message.role;
            }
        }
    });

    return adjustedPrompt;
}
function convertQwenToOpenAIFormat(qwenOutput,model) {
    // 将qwen的输出格式转换为OpenAI接口的输出格式
    const openAIFormat = {
        id: qwenOutput.request_id,
        object: "text_completion",
        created: Date.now(), // 使用当前时间戳作为创建时间
        model: "custom", // 假设模型为自定义，因为qwen的模型名称在输出中未指定
        choices:[
            {message:{
                role:'assistant',content:qwenOutput.output.text
            }}],
        usage: {
            prompt_tokens: qwenOutput.usage.input_tokens,
            completion_tokens: qwenOutput.usage.output_tokens,
            total_tokens: qwenOutput.usage.input_tokens + qwenOutput.usage.output_tokens
        }
    };
    return openAIFormat;
}