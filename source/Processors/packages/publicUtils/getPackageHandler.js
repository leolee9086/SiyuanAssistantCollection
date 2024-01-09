import { sac } from "../../../asyncModules.js"
export const 根据主题获取包管理器实例=(topic)=>{
    return sac.statusMonitor.get('packages',topic).$value
}