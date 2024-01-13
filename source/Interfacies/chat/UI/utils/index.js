async function 初始化块聊天管理器(){
    sac.protyles.forEach(async protyle => {
        await 判定是否聊天历史(protyle.protyle.wysiwyg.element)
    });
}

async function 判定是否聊天历史(编辑器内容元素){
    let 块属性 =编辑器内容元素.getAttribute('custom-ai-chat-history')
    if(块属性){
        编辑器内容元素.style.outline="1px dashed blue"
        let 块元素数组 = 编辑器内容元素.querySelectorAll('[data-node-id]')
        初始化块聊天历史(块元素数组)
    }
}
function 初始化块聊天历史(块元素数组){
    块元素数组.forEach(element => {
        const role = ['user', 'system', 'assistant'].includes(element.getAttribute('custom-chat-role')) ? element.getAttribute('custom-chat-role') : 'user';
        element.setAttribute('custom-chat-role',role)   
        sac.eventBus.on('click-blockicon',(e)=>{
            console.log(e.detail,e.detail.blockElements,element)
            if(e.detail.blockElements[0]==element){
                e.detail.menu.addItem(
                    {
                        icon:"#iconSparkles",
                        label:"笔记聊天",
                        submenu:[
                            {
                                icon:"#iconSparkles",
                                label:"测试",
                            }
                        ]
                    }
                )
            }
        })
    });

}
async function completeNote(blockElements){
    let noteChat = blockElements.map(item=>{
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