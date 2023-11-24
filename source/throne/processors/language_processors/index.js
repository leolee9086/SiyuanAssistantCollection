import {LanguageProcessor as OPENAI} from './OpenAI.js'
import {LanguageProcessor as SPARK}  from './SPARK.js'
import {LanguageProcessor as RWKV}  from './SPARK.js'
import {LanguageProcessor as ZHIPU}  from './ZHIPU.js'

import fs from '../../../polyfills/fs.js'
import { getPersonaSetting } from '../../setting/index.js'

let apiURL = import.meta.resolve('./LLMAPIS')
let apiList = await fs.readDir('/data/plugins/'+apiURL.split('plugins')[1])
apiList =apiList.filter(
    file=>{
        return file.name.endsWith('Chat.js')&&!file.isDir
    }
)

let 模型字典 = {
    OPENAI,
    SPARK,
    RWKV,
    ZHIPU
}
export const getLanguageProcessor=(name)=>{
    let 当前基础后端接口 =  getPersonaSetting(name,'聊天工具设置','基础模型接口').$value

    return 模型字典[当前基础后端接口]||OPENAI
}