import { sac } from "../../../asyncModules.js";
import { 获取数据集状态 } from "../../database/publicUtils/endpoints.js";
import { 块数据集名称 } from "./name.js";



export const 检查数据集是否已加载完成 = async () => {
    try {
        let 数据集状态 = await 获取数据集状态(块数据集名称);
        if (!数据集状态.body.dataLoaded) {
            sac.logger.indexlog('数据集加载未完成,跳过本轮清理');
            return false;
        }
    } catch (e) {
        console.error(e);
        return false;
    }
    return true;
};
