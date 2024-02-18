import { dict } from "../../../utils/tokenizer/jieba.js"
export const tipsRender = class {
    //这个函数会在protyle编辑时不断执行

    async renderEditorTips(editorContext) {
        this.internalFetch('/search/blocks/text', {
            body: {
                query: editorContext.text
            },
            method: 'POST',
        }).then(
            res => {
                let data = res.body
                if (data && data.item) {
                    data.item = data.item.map(
                        item => {
                            item.targetBlocks = [editorContext.blockID]
                            item.type = 'keyboardTips'
                            return item
                        }
                    ).filter(
                        item => {
                            return item.block.id !== editorContext.blockID
                        }
                    )
                }
                //如果主动调用showTips函数的话,就必须给出编辑器上下文,否则会被直接忽略
                res.body ? this.showTips(data, editorContext) : null
            }
        ).catch(e => {

        })
        dict.forEach(
            word => {
                let currentWord= editorContext.currentToken.word.trim()
                if (currentWord&& word.startsWith(currentWord)) {
                    let tips = {
                        title: "补全",
                        description: "删除光标所在的块",
                        link: `测试`,
                        targetBlocks: [editorContext.blockID],
                        id: this.Lute.NewNodeID(),
                        source: "补全",
                        item: [],
                    }
                    tips.item.push(
                        {
                            title: "补全文本",
                            link: `siyuan://blocks/${editorContext.blockID}`,
                            id: this.Lute.NewNodeID(),
                            targetBlocks: [editorContext.blockID],
                            description: `${currentWord}=>{${word}}`,
                            action: {
                                actionRouter: '/ui/highLightToken',
                                params: { token: editorContext.currentToken }
                            },
                            timeout: 5000,
                            contextID:editorContext.id
                        },
                    )
                    this.showTips(tips, editorContext)

                }
            }
        )

    }

}