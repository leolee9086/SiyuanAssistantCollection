import { buildShell } from "./shellFactory/index.js";
import fs from "../polyfills/fs.js";
export { fs as fs }
import database from '../vectorStorage/dataBase.js'
export { database as database }
import { pluginInstance as plugin } from "../asyncModules.js";
import roster from "./ghostDomain/index.js";
//@ts-expect-error
import './processors/visual_processors/openAiText2Image.js'
export { plugin as plugin }
let chatSetting = plugin.configurer.get('chat').$value
export { chatSetting as chatSetting }
plugin.AiShells=plugin.AiShells||{}
export class Marduk {
    constructor() {
    }
    async createInterface(persona, options, ShellType = 'typeCommon') {
        //按照设置找到一个合适的AI实例
        let doll = await this.buildDoll(persona, ShellType)
        return doll.createInterface(options)
    }
    async buildDoll(persona, ShellType, processors, drivers) {
        console.log(persona)
        if(!plugin.AiShells[persona.name||persona]){
            let ghost = await roster.findGhost(persona)
            if (!ghost.shell) {
                //这一步可能造成阻塞
                let shell = await buildShell(ShellType, processors, drivers)
                await ghost.use(shell)
                await shell.restrict(ghost)
            }
            plugin.currentAI =ghost.shell
            plugin.AiShells[ghost.name]=ghost.shell
            return ghost.shell
    
        }else{
            return plugin.AiShells[persona.name||persona]
        }
    }
}

export default new Marduk()