import kernelApi from '../../polyfills/kernelApi.js'
import { clientApi,pluginInstance as plugin } from '../../asyncModules.js'
import throneManager from '../../throne/index.js'

export const AI对话框 = async (标题, aiIdentifier) => {
    let aiChatInterface
    let dialog = new clientApi.Dialog({
        title: 标题,
        content: `<div id="ai-chat-interface" class='fn__flex-column' style="pointer-events: auto;overflow:hidden"></div>`,
        destroyCallback: () => {
            
            aiChatInterface.aiChatUI = undefined;
        },
        width: '600px',
        height: 'auto',
        transparent: true,
        disableClose: false,
        disableAnimation: false
    }, () => {
    });
    aiChatInterface = (await throneManager.buildDoll(aiIdentifier.persona)).createInterface(
        {
            type: 'textChat',
            describe: '一个HTML用户界面,用于向用户展示图文信息',
            container: dialog.element.querySelector("#ai-chat-interface"),
        }
    );
    dialog.element.style.pointerEvents = 'none'
    dialog.element.style.zIndex = '1'
    dialog.element.querySelector(".b3-dialog__container").style.pointerEvents = 'auto'
    dialog.controller=aiChatInterface;
    return dialog
};

export class AI对话框控制器{
    constructor (persona,id) {
        this.persona = persona
        this.id= id
    }
    async init(){
        await plugin.statusMonitor.set('aiDialogs',this.id,this)
        this.inited = true
    }
    async show(){
        let 对话框 = await AI对话框(
            this.persona,
            {
                persona:this.persona
            }
        )
        this.对话框实例 = 对话框
        this.isOpen = true
    }
    async hide(){
        if(this.对话框实例){
        this.对话框实例.destroy()
        this.对话框实例= undefined
        }
        this.isOpen=false

    }
    async changePersona(persona){
        if (this.isOpen){
            await this.hide()            
        }
        this.persona=persona
        await this.show()
    }
}

let 主AI名 = await plugin.configurer.get('聊天工具设置','默认AI').$value
export class 主AI对话框控制器 extends AI对话框控制器{
    constructor(){
        super(主AI名,'MAIN')
    }
    async changePersona(persona){
        await plugin.configurer.set('聊天工具设置','默认AI',persona)
        await super.changePersona(persona)
    }
}
export const 主AI对话框 = new 主AI对话框控制器()
