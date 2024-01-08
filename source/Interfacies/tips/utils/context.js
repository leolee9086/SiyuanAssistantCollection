import { sac } from "../runtime.js"
export const getCurrentEditorContext = ()=>{
    return sac.statusMonitor.get('context','editor').$value||{}
}