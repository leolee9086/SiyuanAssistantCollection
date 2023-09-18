import { pluginInstance } from "../../../asyncModules";
let getConfig=async(name)=>{
    let obj={}
    obj = (await pluginInstance.loadData(`/LLMAPICONFIG/${name}.json`))||{}
    return obj
}
let saveConfig=async(name,data)=>{
    await pluginInstance.saveData(`/LLMAPICONFIG/${name}.json`,data)
}

export let configer={
    getConfig,
    saveConfig
}