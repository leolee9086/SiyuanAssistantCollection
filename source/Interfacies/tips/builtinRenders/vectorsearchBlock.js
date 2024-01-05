import {internalFetch,kernelApi} from 'runtime'
export let 显示文字搜索结果 = (editorContext, element) => {
    sac.路由管理器.internalFetch('/search/blocks/text', {
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
                        return item
                    }
                )
            }
            res.body ? showTips(data, element) : null
        }
    )
}
