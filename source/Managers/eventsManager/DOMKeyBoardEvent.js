import {plugin, sac} from './runtime.js'

export const DOM键盘事件表={
    键盘按下:'keydown-document',
    键盘释放:'keyup-document',
    键盘按压:'keypress-document',
    文本输入:"document-text-input",
    组合结束:"document-composition-end",
    组合更新:"document-composition-updated"
}
export const 开始监听DOM键盘事件=()=>{
    document&&document.addEventListener(
        "keydown",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.键盘按下,e)
        },{ capture: true, passive: true }
    )
    document&&document.addEventListener(
        "keyup",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.键盘释放,e)
        },{ capture: true, passive: true }
        )
    document&&document.addEventListener(
        "keypress",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.键盘按压,e)
        },{ capture: true, passive: true }
        )
    //当用户在可编辑元素上输入字符时触发。这个事件可以用来捕获用户输入的字符。
    document&&document.addEventListener(
        "textInput",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.文本输入,e)
        },{ capture: true, passive: true }
        )
    document&&document.addEventListener(
        "compositionstart",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.组合开始,e)
        },{ capture: true, passive: true }
        )
    document&&document.addEventListener(
        "compositionupdate",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.组合更新,e)
        },{ capture: true, passive: true }
        )
    document&&document.addEventListener(
        "compositionend",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.组合结束,e)
        },{ capture: true, passive: true }
        )
    document&&document.addEventListener(
        "copy",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.复制,e)
        },{ capture: true, passive: true }
        )
    document&&document.addEventListener(
        "cut",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.剪切,e)
        },{ capture: true, passive: true }
        )
    document&&document.addEventListener(
        "paste",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.粘贴,e)
        },{ capture: true, passive: true }
        )
    document&&document.addEventListener(
        "select",
        (e)=>{
            sac.eventBus.emit(DOM键盘事件表.选择,e)
        },{ capture: true, passive: true }
        )
}