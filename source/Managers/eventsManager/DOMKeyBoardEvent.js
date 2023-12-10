import {plugin, sac} from './runtime.js'
/*document.addEventListener(
    "keydown",
    async (e) => {
        if (e.code && (e.code === "ArrowUp" || e.code === "ArrowDown")) {
            return
        }
        plugin.tokenMenu && plugin.tokenMenu.menu ? plugin.tokenMenu.menu.remove() : null
        if (e.code === "Space" || e.code === "Enter") {
            // 触发菜单的 runAction 方法
            if (plugin.currentHintAction && plugin.currentHintAction.runAction) {
                e.preventDefault(); // 阻止原生事件的默认行为
                e.stopPropagation()
                e.stopImmediatePropagation()
                try {
                    plugin.tokenMenu && plugin.tokenMenu.menu && plugin.tokenMenu.menu.remove(); // 移除菜单
                    plugin.currentHintAction.runAction();

                } catch (e) {
                    logger.eventwarn(e)
                }
            }
        }
    },
    { capture: true }
);*/
export const DOM键盘事件表={
    键盘按下:'keydown-document',
    键盘释放:'keyup-document',
    键盘按压:'keypress-document'
}
export const 开始监听DOM键盘事件=()=>{
    document&&document.addEventListener(
        "keydown",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.键盘按下,e)
        }
    )
    document&&document.addEventListener(
        "keyup",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.键盘释放,e)
        }
    )
    document&&document.addEventListener(
        "keypress",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.键盘按压,e)
        }
    )
    //当用户在可编辑元素上输入字符时触发。这个事件可以用来捕获用户输入的字符。
    document&&document.addEventListener(
        "textInput",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.文本输入,e)
        }
    )
    document&&document.addEventListener(
        "compositionstart",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.组合开始,e)
        }
    )
    document&&document.addEventListener(
        "compositionupdate",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.组合更新,e)
        }
    )
    document&&document.addEventListener(
        "compositionend",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.组合结束,e)
        }
    )
    document&&document.addEventListener(
        "copy",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.复制,e)
        }
    )
    document&&document.addEventListener(
        "cut",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.剪切,e)
        }
    )
    document&&document.addEventListener(
        "paste",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.粘贴,e)
        }
    )
    document&&document.addEventListener(
        "select",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.选择,e)
        }
    )
}