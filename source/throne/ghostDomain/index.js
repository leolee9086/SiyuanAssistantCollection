import { plugin } from '../../asyncModules.js'
import path from '../../polyfills/path.js'
import fs from '../../polyfills/fs.js'
import Ghost from './GhostProto.js'
export { plugin as plugin }
const GhostURL = `${plugin.selfURL}/installed/personas`
const GhostPath = `/data/plugins/${plugin.name}/installed/personas`
let personas = await fs.readDir(GhostPath)
let _roster = window[Symbol.for('ghostRoster')]
let AkashicPath = `/data/storage/petal/${plugin.name}/Akashic`
if (!_roster) {
    _roster = new Map()
    window[Symbol.for('ghostRoster')] = _roster
}
for (let persona of personas) {
    console.log(persona, personas)
    if (persona.name == 'DummySys') {
        let module = await import(`${GhostURL}/${persona.name}/Ghost.js`)
        _roster.set(persona.name, module['default'])
        console.log(persona, personas)
        continue
    }
    if (persona.isDir && persona.name) {
        console.log(persona)
        if (await fs.exists(path.join(GhostPath, persona.name, 'persona.js'))) {
            let module = await import(`${GhostURL}/${persona.name}/persona.js`)
            let ghost = new  Ghost(module['default'])
            _roster.set(persona.name, ghost)
            plugin.statusMonitor.set('AiGhosts', persona.name, ghost)
        } else if (await fs.exists(path.join(GhostPath, persona.name, 'Ghost.js'))) {
            let module = await import(`${GhostURL}/${persona.name}/Ghost.js`)
            console.log(module['default'])
            let ghost =new (module['default'])()
            _roster.set(persona.name, ghost)

            plugin.statusMonitor.set('AiGhosts', persona.name, ghost)
        }
    }
}
class Roster {
    constructor() {

    }
    findGhost(
        persona
    ) {
        let name = persona.name || persona
        if (!plugin.statusMonitor.get('AiGhosts',name).$value) {
            let DummySys = _roster.get("DummySys")
            console.warn(`ghost of persona ${name} not found,DummySys online`)
            let ghost =DummySys.fake(name, persona.persona, persona.goal)
            plugin.statusMonitor.set('AiGhosts', name, ghost).$value
            return ghost
        } else {
            return plugin.statusMonitor.get('AiGhosts',name).$value
        }
    }
    async listMems(){
        let mems = await fs.readDir(AkashicPath)
        mems = mems.filter(
            mem=>{
                return mem.name.endsWith('.mem')&&!mem.name.endsWith('.back.mem')
            }
        ) 
        return mems
    }
    async listGhostNames(){
        //这里使用记忆来列举AI是为了避免列出加载失败的ghost
        let mems = await this.listMems()
        let ghostNames = []
        for(let mem of mems){
            ghostNames.push(mem.name.split('.')[0])
        }
        return ghostNames
    }
}
export default new Roster() 