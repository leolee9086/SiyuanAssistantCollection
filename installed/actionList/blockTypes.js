export default [
    {
        icon:'iconTrash',
        label:'',
        matchMod:'include',
        hints:'删除,删除当前文档,删文档,删掉文档,干掉当前文档',
        hintAction:(context)=>{
            context.blocks.forEach(
                block=>{block.removeRoot()}
            )
        }
    }
]