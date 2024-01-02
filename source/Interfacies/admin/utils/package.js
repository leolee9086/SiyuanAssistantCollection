import { sac } from "../../../asyncModules.js"
let {路由管理器}=sac
let {internalFetch}=路由管理器
export const  install=async(packageInfo)=>{
    let {topic}=packageInfo
    let res =await internalFetch(`/packages/${topic}/install`, {
        body: packageInfo, method: 'POST'
    })
    return res
}