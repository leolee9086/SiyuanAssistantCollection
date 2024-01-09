import { kernelApi } from "../asyncModules.js"
export const 根据笔记本ID获取笔记本=async(id)=>{
    let 笔记本列表 = (await kernelApi.lsNotebooks()).notebooks
    return 笔记本列表.find(item=>{
        return item.id===id
    })
}