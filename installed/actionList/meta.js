import { plugin } from "../runtime.js";
let actionList = plugin.actionList.actionList
let list = () => {
    let L= actionList.map(
        (item) => {
            let setting = plugin.configurer.get("动作设置", '关键词动作设置', item.provider).$value
            if (setting) {
                return {
                    icon: 'iconTrash',
                    label: `关闭动作表:${item.provider}`,
                    hints: '关闭动作表,关掉动作表,close,disable,actionList',
                    hintAction: async (context) => {
                        await plugin.configurer.set("动作设置", '关键词动作设置', item.provider, false)
                        await context.menu.menu.remove()
                        context.token.delete()
                    }
                }
            } else {
                return {
                    icon: 'iconTrash',
                    label: `开启动作表:${item.provider}`,
                    hints: '开启动作表,打开动作表,open,enable,actionList',
                    hintAction: async (context) => {
                        await plugin.configurer.set("动作设置", '关键词动作设置', item.provider, true)
                        await context.menu.menu.remove()
                        context.token.delete()
                    }
                }
            }
        }
    ).filter(item => { return item }).concat(
        [
            {
                icon: '',
                label: `标记为待索引`,
                hints: 'index,索引,矢量索引',
                blockAction: async (context) => {
                    context.blocks.forEach(
                        block => {
                            block.setAttributes(
                                {
                                    'custom-publish-vectorindex': "true"
                                }
                            )
                        }
                    )
                }

            }
        ]
    )
    try {
        let 情景模式列表 = plugin.configurer.get('动作设置', '情景模式').$raw.options
        情景模式列表.forEach(
            (情景名)=>{
                L.push(
                    {
                        icon: 'iconTrash',
                        label: `切换到情景模式:${情景名}`,
                        hints: '情景,动作表,切换'+','+情景名,
                        hintAction: async (context) => {
                            let 情景设置内容 = plugin.configurer.get('动作设置',"情景模式编辑",情景名).$value||{}
                            actionList.forEach(
                                item=>{
                                     plugin.configurer.set("动作设置", '关键词动作设置', item.provider,情景设置内容[item.provider]?true:false)
                                }
                            )
                            await plugin.configurer.set("动作设置", '情景模式', 情景名)
                        }
                    }
                )
                L.push(
                    {
                        icon: 'iconTrash',
                        label: `保存当前设置为情景模式:${情景名}`,
                        hints: '情景,动作表,保存'+','+情景名,
                        hintAction: async (context) => {
                            let 情景设置内容 = plugin.configurer.get("动作设置", '关键词动作设置').$value||{}
                            await plugin.configurer.set('动作设置',"情景模式编辑",情景名,JSON.parse(JSON.stringify(情景设置内容)))
                            await plugin.configurer.set("动作设置", '情景模式', 情景名)
                        }
                    }
                )

            }
        )
    } catch (e) {
        console.error(e)
    }
    return L
}

export default list