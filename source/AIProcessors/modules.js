import { sac } from "../asyncModules.js"
export const modelModule ={
    安装位置:工作空间地址('/public/onnxModels'),
    下载函数:(模型名称)=>{
        if(sac.包管理器.校验源('huggingface')){
            console.log('huggingface源可用',模型名称)
        }
    },
    加载函数:(模型名称,模型参数)=>{
        sac.statusMonitor.set('onnxModels',模型名称,模型参数)
    },
    获取可用包列表:()=>{
        if(sac.包管理器.校验源('huggingface')){
            return sac.包管理器.适配器.huggingface.过滤({
                librarie:'transformer.js'
            })
        }
    }
}