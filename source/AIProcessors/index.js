import openAiChat from "./openAI/chat.js"
import {completeText} from './openAI/textCompelete.js'
export const 自然语言处理 ={
    对话补全:{
        描述:"根据给出的对话补全下一句对话,常用于聊天机器人等场景",
        模型:{
            openAI:openAiChat,
        }
    },
    填空:{
        描述:"根据给出的文本补全其中被遮盖的部分"
    },
    文本补全:{
        描述:"根据给出的文本对内容进行补全,常用于写作辅助",
        模型:{
            openAI:{
                complete:completeText
            }
        }
    }
}
console.log('ai处理器加载完毕')
