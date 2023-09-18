let 移动到最近文档 = async(context) => {
    let target = await context.plugin.界面.弹窗.选择最近文档()
    await context.blocks[0].moveTo(target)
}
export default [
    {
        icon: 'iconMove',
        label:'快速移动到最近文档',
        hints: '快速移动,移动,最近,文档',
        hintAction: 移动到最近文档,
    },
    {
        icon: 'iconMove',
        label:'快速移动到父文档',
        hints: '快速移动,移动,文档',
        hintAction: async(context) => {
            let target = await context.blocks[0].path.split('/').slice(-2, -1)[0]
            await context.blocks[0].moveTo(target)
        },
    },
    {
        icon: 'iconMove',
        label:'快速移动到子文档',
        hints: '快速移动,移动,child,文档',
        hintAction: async(context) => {
            let sql = `select * from blocks where path like '${context.blocks[0].path.split('.')[0]}%' and type = 'd'`
            let blocks = context.kernelApi.sql.sync({stmt:sql})
            let target = await context.plugin.界面.弹窗.从块列表中选择(blocks,'子文档')
            await context.blocks[0].moveTo(target)
        },
    }
]