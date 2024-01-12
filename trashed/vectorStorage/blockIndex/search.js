import { logger } from "../../../source/logger/index.js";
import { plugin } from "../../../source/asyncModules.js";
export let searchWithVector = async(...args)=>{
    return await plugin.块数据集.以向量搜索数据(...args)
}