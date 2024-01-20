export const tipsRender = class {
    async renderEditorVectorTips(editorContext) {
        try {
            let res = await this.internalFetch('/search/blocks/vector', {
                body: {
                    query: editorContext.editableElement.innerText,
                    filter_before: {
                        "id": { $ne: editorContext.blockID }
                    }
                },
                method: 'POST',
            });
            let data = res.body;
            if (data && data.item) {
                data.item = data.item.map(item => {
                    item.targetBlocks = [editorContext.blockID];
                    item.vector = item.block.vector;
                    return item;
                });
                this.showTips(data, editorContext);
            }

            res = await this.internalFetch('/search/rss/vector', {
                body: {
                    query: editorContext.editableElement.innerText,
                },
                method: 'POST',
            });
            data = res.body.data;
            if (data && data.item) {
                data.item = data.item.map(item => {
                    item.targetBlocks = [editorContext.blockID];
                    return item;
                });
                this.showTips(data, editorContext);
            }

            if (editorContext.currentToken && editorContext.currentToken.word.length >= 2) {
                res = await this.internalFetch('/search/blocks/vector', {
                    body: {
                        query: editorContext.currentToken.word,
                        filter_before: {
                            "id": { $ne: editorContext.blockID }
                        }
                    },
                    method: 'POST',
                });
                data = res.body;
                if (data && data.item) {
                    data.item = data.item.map(item => {
                        item.targetBlocks = [editorContext.blockID];
                        item.vector = item.block.vector;
                        return item;
                    });
                    this.showTips(data, editorContext);
                }

                res = await this.internalFetch('/search/rss/vector', {
                    body: {
                        query: editorContext.currentToken.word,
                    },
                    method: 'POST',
                });
                data = res.body.data;
                if (data && data.item) {
                    data.item = data.item.map(item => {
                        item.targetBlocks = [editorContext.blockID];
                        return item;
                    });
                    this.showTips(data, editorContext);
                }
            }
        } catch (error) {
            console.error('Error rendering editor vector tips:', error);
        }
    }
}