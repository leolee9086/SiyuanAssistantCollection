export const tipsRender = class{
    async renderEditorTips(editorContext){
        this.internalFetch('/search/blocks/vector', {
            body: {
                query: editorContext.editableElement.innerText,
            },
            method: 'POST',
        }).then(
            res => {
                let data = res.body
                if (data && data.item) {
                    data.item = data.item.map(
                        item => {
                            item.targetBlocks = [editorContext.blockID]
                            return item
                        }
                    )
                }
                res.body ? this.showTips(data,editorContext) : null
            }
        )    
    }
}

