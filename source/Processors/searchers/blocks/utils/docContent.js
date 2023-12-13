//这里是为了在webworker中使用
export const 填充文档和标题块内容=(block,lute=globalThis.lute)=>{
        let content = lute.BlockDOM2Text(kernelApi.getDoc.sync({ id: block.id, size: 102400 }).content)
        block.content = content
        return block
}