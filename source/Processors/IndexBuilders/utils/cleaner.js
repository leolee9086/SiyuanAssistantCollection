import { sac,kernelApi } from "../../../asyncModules.js";
let {internalFetch} = sac.路由管理器

export const 清理块索引 = async (数据集名称) => {
    let id数组查询结果 = await internalFetch('/database/keys', {
        method: 'POST',
        body: {
            collection_name: 数据集名称
        }
    })
    console.log(id数组查询结果)
    let id字符串数组 = id数组查询结果.body.data.map(
        item => { return `'${item}'` }
    )
    let idSQL = `select id,hash from blocks where id in (${id字符串数组.join(',')}) limit 102400`
    let data = kernelApi.SQL.sync({ 'stmt': idSQL })
    if (data) {
        data = data.map(item => {
            return item.id
        })
        let id数组1 = id数组查询结果.body.data.filter(
            item => { return !data.includes(item) }
        )
        console.log(`删除${id数组1.length}条多余索引`)
        await internalFetch('/database/delete', {
            method: "POST", body: {
                collection_name: 数据集名称,
                keys: id数组1
            }
        })
    }
}