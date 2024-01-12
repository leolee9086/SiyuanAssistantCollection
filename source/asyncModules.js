//import * as jieba from '../static/jieba_rs_wasm.js'
import kernelApi from './polyfills/kernelApi.js';
//为了在webworker环境中可以使用
let pluginName  = import.meta.resolve('../').split('/').filter(item=>{return item}).pop()
let pluginInstance
let clientApiInstance
pluginInstance=globalThis[Symbol.for(`plugin_${pluginName}`)]
clientApiInstance=globalThis[Symbol.for(`clientApi`)]
export {clientApiInstance as clientApi}
export {pluginInstance as plugin}
export {pluginInstance as sac}
export {kernelApi as kernelApi}
export const Constants = {
    helpID:'20231028183434-6oflpzo',
    HELP_PATH : {
        zh_CN: "20210808180117-czj9bvb",
        zh_CHT: "20211226090932-5lcq56f",
        en_US: "20210808180117-6v0mkxr",
        fr_FR: "20210808180117-6v0mkxr",
    },
    Plugin_Help_path:{
        zh_CN: "SAC插件帮助.sy.zip",
    },
    Plugin_Help_name:{
        zh_CN: "SAC-请从这里开始",
    },
    CB_MOUNT_REMOVE:"cb-mount-remove",
    模型存放地址:'/data/public/onnxModels/',
    思源常量:clientApiInstance?clientApiInstance.Constants:undefined
}