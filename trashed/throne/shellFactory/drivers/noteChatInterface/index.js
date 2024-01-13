import { kernelApi } from "../../../../asyncModules.js";
import { logger } from "../../../../logger/index.js";
import BlockHandler from "../../../../utils/BlockHandler.js";

export class noteChat {
    constructor(options){
        this.blockElements=options.blockElements
    }
    init(){
        logger.noteChatlog(this.blockElements)
        this.buildChat()
        this.completeNote()
    }
    buildChat(){
        this.blockElements.forEach(element => {
            const role = ['user', 'system', 'assistant'].includes(element.getAttribute('custom-chat-role')) ? element.getAttribute('custom-chat-role') : 'user';
            element.setAttribute('custom-chat-role',role)   
        });
    }
    async completeNote(){
        let noteChat = this.blockElements.map(item=>{
            return {role:item.getAttribute('custom-chat-role'),content:(new BlockHandler(item.getAttribute('data-node-id'))).markdown}
        })
        let merged =mergeUserDialogue(noteChat)
        let content =await this.shell.completeChat(merged,true)
        let last= new BlockHandler(this.blockElements[this.blockElements.length-1].getAttribute('data-node-id'))
        if(last){
            let data =await last.insertAfter(content)
            logger.noteChatlog(data)
            data.forEach(
                item=>{
                    item.doOperations.forEach(
                        async item=>{
                            await kernelApi.setBlockAttrs({id:item.id,attrs:{'custom-chat-role':'assistant'}})
                        }
                    )
                }
            )
        }
    }
    
}
function mergeUserDialogue(notechat) {
    let mergedDialogue = [];
    let tempContent = '';
    
    // 如果第一个角色不是 'user'，添加一个 'user' 角色，内容是 '你好'
    if (notechat.length > 0 && notechat[0].role !== 'user') {
        mergedDialogue.push({role: 'user', content: '你好'});
    }

    for (let i = 0; i < notechat.length; i++) {
        if ((notechat[i].role === 'user' || notechat[i].role === 'assistant' || notechat[i].role === 'system') && (i === notechat.length - 1 || notechat[i + 1].role !== notechat[i].role)) {
            tempContent += notechat[i].content;
            mergedDialogue.push({role: notechat[i].role, content: tempContent});
            tempContent = '';
        } else if (notechat[i].role === 'user' || notechat[i].role === 'assistant' || notechat[i].role === 'system') {
            tempContent += notechat[i].content + ' ';
        } else {
            mergedDialogue.push(notechat[i]);
        }
    }
    for (let i = 1; i < mergedDialogue.length; i++) {
        if (mergedDialogue[i].role === 'system' && mergedDialogue[i].content === '') {
            continue;
        }
        if (mergedDialogue[i].role === mergedDialogue[i - 1].role) {
            throw new Error("角色 'user', 'system', 'assistant' 必须交替出现");
        }
    }
    // 如果最后一个角色不是 'user'，添加一个 'user' 角色，内容是 '继续'
    if (mergedDialogue.length > 0 && mergedDialogue[mergedDialogue.length - 1].role !== 'user') {
        mergedDialogue.push({role: 'user', content: '继续'});
    }

    return mergedDialogue;
}