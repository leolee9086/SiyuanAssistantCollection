import {  plugin } from "../runtime.js";
let actionList = plugin.actionList.actionList
let list = ()=>{
    return actionList.map(
        (item)=>{
            let setting = plugin.configurer.get("动作设置",'关键词动作设置',item.provider).$value
            if(!setting||setting&&!setting.disabled){
                return {
                    icon: 'iconTrash',
                    label: `关闭动作表:${item.provider}`,
                    hints: '关闭动作表,关掉动作表,close,disable,actionList',
                    hintAction:async(context)=>{
                        await plugin.configurer.set("动作设置",'关键词动作设置',item.provider,{disabled:true})
                        await context.menu.menu.remove()
                        context.token.delete()
                    }
                }
            }else{
                return {
                    icon: 'iconTrash',
                    label: `开启动作表:${item.provider}`,
                    hints: '开启动作表,打开动作表,open,enable,actionList',
                    hintAction:async(context)=>{
                        await plugin.configurer.set("动作设置",'关键词动作设置',item.provider,{disabled:false})
                        await context.menu.menu.remove()
                        context.token.delete()
                    }
                }
            }
        }
    ).filter(item=>{return item}).concat(
        [
            {
                icon: '',
                label: `标记为待索引`,
                hints: 'index,索引,矢量索引',
                blockAction:async(context)=>{
                    context.blocks.forEach(
                        block=>{
                            block.setAttributes(
                                {
                                    'custom-publish-vectorindex':"true"
                                }
                            )
                        }
                    )
                }

            }
        ]
    )
}
export default list