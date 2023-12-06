import { plugin } from "../runtime.js"
//这个可以用来修改设置界面的提醒
plugin.statusMonitor.set('settingDescribe','动作设置.关键词动作设置.blockStyleYellow_js','用来设置块的背景色和文字颜色,颜色来自中国传统配色')

/**
 * 中文颜色对照表
 * 就非常简单粗暴
 */
let 颜色对照表 =[
    
]

let actions = []
let dict = ''
颜色对照表.forEach(
    颜色项 => {
        dict+=颜色项.name+','+颜色项.pinyin+','
        actions.push(
            {
                icon: "iconFont",
                label: () => {
                    return {
                        zh_CN: `修改颜色为${颜色项.name}`,
                        en_US: `set color to ${颜色项.pinyin}`
                    }
                },
                hints: `${颜色项.name},颜色,color`,
                active: (menu, element) => {
                    if (element.token) {
                        element.token.highlight()
                    }
                },
                hintAction: (context) => {
                    context.blocks.forEach(block => {
                        block.style.color = 颜色项.hex
                    });
                    if (context.token) {
                        context.token.select()
                        context.token.delete()
                    }
                },
                blockAction: (context) => {
                    context.blocks.forEach(
                        block=>   block.style.color = 颜色项.hex
                    )
                }
            },
        )
        actions.push(
            {
                iconHTML: `<button class="color__square" data-type="backgroundColor" style="background-color:${颜色项.hex}"></button>`,
                label: () => {
                    return {
                        zh_CN: `修改背景颜色为${颜色项.name}`,
                        en_US: `set background to ${颜色项.pinyin}`
                    }
                },
                hints: `${颜色项.name},背景色,background`,
                active: (menu, element) => {
                    if (element.token) {
                        element.token.select()
                    }
                },
                hintAction: (context) => {
                    context.blocks.forEach(block => {
                        block.style.backgroundColor = 颜色项.hex
                    });
                    if (context.token) {
                        context.token.select()
                        context.token.delete()
                    }
                },
                blockAction: (context) => {
                    context.blocks.forEach(
                       block=> block.style.backgroundColor = 颜色项.hex
                    )
                }
            },
        )
    }
)
export default actions
export { dict as dict }