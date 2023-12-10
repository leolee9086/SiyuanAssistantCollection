import {sac} from '../runtime.js'
export const getTipsContainers=(type='main')=>{
    return sac.statusMonitor.get('tipsConainer',type).$value
}