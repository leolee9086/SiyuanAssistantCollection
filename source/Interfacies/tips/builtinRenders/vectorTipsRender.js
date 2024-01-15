export const tipsRender = class {
    async renderEditorVectorTips(editorContext) {
        this.internalFetch('/search/blocks/vector', {
            body: {
                query: editorContext.editableElement.innerText,
                filter_before: {
                    "id": { $ne: editorContext.blockID }
                }
            },
            method: 'POST',
        }).then(
            res => {
                let data = res.body
                if (data && data.item) {
                    data.item = data.item.map(
                        item => {
                            item.targetBlocks = [editorContext.blockID]
                            item.vector = item.block.vector
                            return item
                        }
                    )
                }

                res.body ? this.showTips(data, editorContext) : null
            }
        )
        this.internalFetch('/search/rss/vector', {
            body: {
                query: editorContext.editableElement.innerText,
            },
            method: 'POST',
        }).then(
            res => {
                let data = res.body.data
                if (data && data.item) {
                    editorContext.logger.rssVectorTipserror("成功使用向量搜索生成tips")
                    data.item = data.item.map(
                        item => {
                            item.targetBlocks = [editorContext.blockID]
                            return item
                        }
                    )
                }
                res.body ? this.showTips(data, editorContext) : null
            }
        )
    }
}

