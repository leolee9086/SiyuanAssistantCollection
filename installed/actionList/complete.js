import { 自然语言处理 } from "../runtime.js";
export default async(context) => {
    let content = context.blocks[0].content
    return [
        {
            label: '使用openAI补全',
            hints: 'openAI,chatgpt,补全,设置',
            hintAction: async() => {
                let text = await 自然语言处理.文本补全.模型.openAI.complete(content)
                context.blocks[0].insertAfter(text)
            }
        },
    ]
}