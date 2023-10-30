import { plugin } from "../../asyncModules.js";
import fs from "../../polyfills/fs.js";
import path from "../../polyfills/path.js"
import { searchRef } from "./drivers/searcher.js";
let meta= import.meta
let factoryURL =path.dirname(new URL(meta.url).pathname)
let factoryLocation =path.join('/data',factoryURL)
export async function listShells(){
    let shells = [];
    let shellList = [];
    try {
        console.log(import.meta)
        shells = await fs.readDir(factoryLocation);
    } catch (e) {
        console.error("Error reading directory:", e);
        return shellList;
    }
    for (let shellConstructor of shells){
        if(shellConstructor.name !== 'index.js' && !shellConstructor.isDir){
            try {
                let module = await import(path.join(factoryURL, shellConstructor.name));
                shellList.push({name: shellConstructor.name, constructor: module['default']});
            } catch (e) {
                console.error(`Error importing module ${shellConstructor.name}:`, e);
            }
        }
    }
    return shellList;
}
export async function buildShell(requiredType, drivers, processors){
    let type = fixTypeName(requiredType)
    let Shells = await listShells();
    let typeFileName= type.endsWith('.js')?type:type+'.js'
    let Shell = Shells.find(item => item.name === typeFileName);
    if(!Shell){
        Shell = Shells.find(item => item.name === 'typeCommon.js');
    }
    if(!Shell){
        console.error("No suitable shell found.");
        return null;
    }
    let copy;
    try {
        copy = new Shell.constructor();
    } catch (e) {
        console.error("Error creating shell:", e);
        return null;
    }
    try {
        drivers?copy.addDriver(drivers):null;
        processors?copy.changeProcessor(processors):null;
    } catch(e) {
        console.warn("Error configuring shell:", e);
    }
    //如果自动给出参考,就给shell添加搜索器
    if(plugin.configurer.get('聊天工具设置','自动给出参考').$value){
        copy.drivers.search.push(
            {
                search:searchRef
            }
        )
    }
    return copy;
}
function fixTypeName(requiredType){
    let type = requiredType
    if(!requiredType){
        console.warn('未指定shell类型，使用模型类型typeCommon')
        type = "typeCommon"
    }
    return type
}