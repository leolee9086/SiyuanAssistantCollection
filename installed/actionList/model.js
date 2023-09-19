import { plugin } from "../runtime.js"
export default[
    {
        label:'设置文本嵌入引擎',
        hints:'嵌入,向量化,文本向量化,设置',
        hintAction:()=>{
            plugin.UI.对话框.向量工具设置对话框.open()
            window.siyuan.menus.menu.remove()
        }
    }
]