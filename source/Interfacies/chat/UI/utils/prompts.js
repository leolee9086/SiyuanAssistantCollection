import { postChatMessage } from "../../../../Processors/AIProcessors/publicUtils/endpoints.js";

//这个对象是一个AI agent的prompt工程工具
export const 时间理解={
    初始系统提示词模板:`
## 系统提示
角色为"system"的消息是系统给与AI的回复提示,**不是用户消息的一部分**,AI在回复user时需要遵循其中的要求,而不是直接回应系统消息
## 时间提醒    
消息中结尾的@time:*年*月*日*时*分*秒代表了消息发送时间
## 附加信息
AI必须在回复的最后以JSON形式添加附加内容
附加内容与你的回复正文之间以'---附加内容---'分割
## 心情评估
AI应该在**每一条**回复的附加内容中以emotion字段添加对用户心情的评估,评分为0至5的5分制,3分为中性或者无法判断,分数越高代表用户心情越积极
`,
    人类用户消息修饰函数(用户消息,聊天上下文){
        const 时间戳 = new Date().toISOString();
        用户消息.timeStamp = `\n@time:${时间戳}`;
        return 用户消息
    },
    插入系统提示词(用户消息,聊天上下文){
        // 根据聊天上下文动态插入提示词，这里只是一个简单示例
        return `
        请注意，所有的时间都以@time:标记,由聊天系统自动添加,时间戳仅仅用于提示你消息发送的时间,一般情况下可以忽略它
        `;
    },   
    AI用户消息修饰函数(用户消息,聊天上下文){
      // 如果AI忘记了添加时间信息,就给它加上
        const 时间戳 = new Date().toISOString();
        用户消息.timeStamp = `\n@time:${时间戳}`;
        return 用户消息
    }
    //@TODO:上下文敏感的提示词修饰
}
export const 长期记忆={
    初始系统提示词模板:`
## 对话笔记    
你必须以
---
@AINoted:
<笔记内容>
---
的形式,记下以后需要使用的任何信息,以备之后使用`,
    人类用户消息修饰函数(用户消息,聊天上下文){
        
    },
    插入系统提示词(用户消息,聊天上下文){
        if(!聊天上下文.最后AI消息.indexOf('@longtime')){
            return `你忘记以规定的形式总结对话笔记了,请注意系统提示词中的对话笔记要求`
        }
        else{
            return `注意,以下内容是在以往的对话中,AI记下的笔记内容,每条笔记最后的@time:*年*月*日*时*分*秒是由聊天系统自动添加的笔记时间戳`
        }
    }
}
export const 对话提示词助手 = {
    async 获取提示建议(messages, seggestions, error) {
        try {
            const promptSuggestionsPrompt = [{
                role: "system",
                content: `你是一个AI对话提示词助手,你的工作是根据给出的对话内容,为用户推荐合适的提问,这有些类似输入法的智能输入提示,这些提示需要满足这些要求:
                问题应该与历史对话紧密相关,有助于进一步的讨论;
                问题不应该出现在历史对话中,也不应该与历史对话中的内容过于近似.
                问题应该以用户的口吻提出,用于触发AI的回复,而不是相反.
                你的回复的每一行包含且仅包含一个问题,**不需要**任何编号等额外内容,只需要简单分行即可
                除了问题之外,禁止输入任何多余内容
                除了问题之外,**禁止**包含任何类似"你可以使用以下建议"、"你可以尝试以下话题"等内容
                必须以尽可能简洁的语言，模仿用户的口吻，直接给出可以**直接被用户用于与AI对话**的提示内容,而不是尝试告诉用户如何提问的技巧
                    正确示例:"你能够帮我做什么?"
                    正确示例:"你能帮我写一段程序吗?"
                    错误示例:"你可以询问AI它有哪些能力"
                    错误示例:"你可以询问AI它能否帮助你编写程序"
                    错误示例:"1.你能帮我编写一段程序吗?"
                给出三到五个最合适的问题
                以上各要求对于正确完成你的任务极其重要，你必须要完全地、始终地、最高优先级地遵守
                尤其必须注意，**不要**输出任何多余的内容
                `
            }, {
                role: "system",
                content: `以下是历史对话:
                ${messages.slice(-5).map(item => { return `${item.role}:${item.content}` }).join('\n')}} }).join('\n')}       
                `
            }, {
                role: "user",
                content: "请根据历史对话，按要求列举三到五个合适的问题,**不要**对问题编号,不要重复提问"
            }]
            let res = await postChatMessage({ model: 'zhipu-chatglm-pro', messages: promptSuggestionsPrompt })
            let { message } = res.choices[0]
            seggestions.push('继续')
            message.content.split('\n').forEach(
                question => seggestions.push(question.replace(/^\d+\./, ''))
            )
        } catch (e) {
            console.error(e);
            error.value = e;
        }
    }
}
