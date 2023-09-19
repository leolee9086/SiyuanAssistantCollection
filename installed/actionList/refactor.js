export default [
    {
        icon:'iconRefact',
        label:"转化为子文档",
        types:'h',
        hints:'子文档,文档,child,转化',
        hintAction:async(context)=>{
            context.token.delete()
            await context.blocks[0].toChildDoc()
            setTimeout(()=>{context.blocks[0].open()},500)
        }
    }
]