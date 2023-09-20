import {LanguageProcessor as OPENAI} from './OpenAI.js'
import {LanguageProcessor as SPARK}  from './SPARK.js'
import {LanguageProcessor as RWKV}  from './SPARK.js'
import { plugin } from '../../../asyncModules.js'
import fs from '../../../polyfills/fs.js'

let 当前基础后端接口 = await plugin.configurer.get('聊天工具设置','基础模型接口')
let apiURL = import.meta.resolve('./LLMAPIS')
let apiList = await fs.readDir('/data/plugins/'+apiURL.split('plugins')[1])
apiList =apiList.filter(
    file=>{
        console.log(file)
        return file.name.endsWith('Chat.js')&&!file.isDir
    }
)
for(let apiFile of apiList){
        console.log(apiFile) 
}
let 模型字典 = {
    OPENAI,
    SPARK,
    RWKV
}
export const getLanguageProcessor=()=>{
    return 模型字典[当前基础后端接口]||OPENAI
}