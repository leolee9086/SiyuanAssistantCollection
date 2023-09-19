import {LanguageProcessor as OPENAI} from './OpenAI.js'
import {LanguageProcessor as SPARK}  from './SPARK.js'
import {LanguageProcessor as RWKV}  from './SPARK.js'
import { plugin } from '../../../asyncModules.js'
let 当前基础后端接口 = await plugin.configurer.get('聊天工具设置','基础模型接口')
let 模型字典 = {
    OPENAI,
    SPARK,
    RWKV
}
export const getLanguageProcessor=()=>{
    return 模型字典[当前基础后端接口]||OPENAI
}