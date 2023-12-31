export const tipsRender = class {
    //这个函数会在protyle编辑时不断执行
    async renderEditorTips(editorContext){
        this.internalFetch('/search/blocks/text', {
            body: {
                query:editorContext.editableElement.innerText
            },
            method: 'POST',
        }).then(
            res => {
                let data=res.body
                if(data&&data.item){
                    data.item=data.item.map(
                        item=>{
                            item.targetBlocks=[editorContext.blockID]
                            item.type='keyboardTips'
                            return item
                        }
                    )
                }
                //如果主动调用showTips函数的话,就必须给出编辑器上下文,否则会被直接忽略
                res.body ? this.showTips(data,editorContext) : null
            }
        )
    }
}