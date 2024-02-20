import { Adapter } from "./zhipu/index.js"
let modelMap = {}
let zhipuAdapter =new Adapter()
let {models}=zhipuAdapter.init()
models['chat/completions'].forEach(
    modelinfo=>{
        let {id}=modelinfo
        let scopedId = zhipuAdapter.nameSpace+'-'+id
        modelMap[scopedId] = modelinfo
    }
)
export const getModelProcess=(modelName)=>{
    if(modelMap[modelName]){
        return modelMap[modelName]
    }else{
        throw '未找到模型'
    }
}
export const listModels=()=>{
    return JSON.parse(JSON.stringify(modelMap))
}