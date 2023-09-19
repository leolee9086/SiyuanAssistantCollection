import { plugin } from "../runtime.js"
export default[
    {
        label:'设置文本嵌入引擎',
        hints:'嵌入,向量化,文本向量化,设置',
        hintAction:()=>{
            plugin.UI.对话框.向量工具设置对话框.open()
            window.siyuan.menus.menu.remove()
        }
    },
    {
        label:'设置聊天后端引擎为讯飞星火',
        hints:'嵌入,聊天,设置,星火',
        hintAction:async()=>{
            await plugin.configurer.set('聊天工具设置',"基础模型接口","SPARK")
            plugin.eventBus.emit('languageProcessor')
        }
    },
    {
        label:'设置聊天后端引擎为OPENAI',
        hints:'聊天,设置,星火,chat,openai,closeAI,chatgpt',
        hintAction:async()=>{
            await plugin.configurer.set('聊天工具设置',"基础模型接口","OPENAI")
            plugin.eventBus.emit('languageProcessor')
        }
    }
]