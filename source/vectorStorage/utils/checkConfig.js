import { plugin } from "../../asyncModules.js"
import fs from "../../polyfills/fs.js"
export let 模型存放地址 = '/data/public/onnxModels/'

let 在线模型列表 = Object.getOwnPropertyNames(plugin.默认设置.模型设置)
let 本地模型列表 = plugin.默认设置.向量工具设置.默认文本向量化模型.options.filter(
    item=>{
        return 在线模型列表.indexOf(item.toUpperCase()) === -1
    }
)
export const 校验索引设置 = async(向量工具设置)=>{
    let 当前向量化模型名 = 向量工具设置.默认文本向量化模型.$value
    let flag = false 
    if(在线模型列表.indexOf(当前向量化模型名)>-1){
        console.log(当前向量化模型名)
    }else{
        flag=await fs.exists(模型存放地址+当前向量化模型名)?true:false
    }
    //这里校验之后如果发现不可用就不进行索引
    return flag
}
