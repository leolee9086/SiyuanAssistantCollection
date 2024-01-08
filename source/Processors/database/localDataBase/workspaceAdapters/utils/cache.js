import { 计算LuteNodeID模 } from "../../utils/mod.js";
export const 创建临时数据对象 =(分组数据对象, 总文件数)=>{
    let 临时数据对象 = {};
    for (let i = 0; i < 总文件数; i++) {
        临时数据对象[i] = {};
    }
    Object.getOwnPropertyNames(分组数据对象).forEach(主键值 => {
        let mod = 计算LuteNodeID模(主键值, 总文件数);
        临时数据对象[mod][主键值] = 分组数据对象[主键值];
    });
    return 临时数据对象;
}