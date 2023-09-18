import { plugin } from '../../asyncModules.js'
import path from '../../polyfills/path.js'
import fs from '../../polyfills/fs.js'
import Ghost from './GhostProto.js'
export { plugin as plugin }
const GhostURL = `${plugin.selfURL}/installed/personas`
const GhostPath = `/data/plugins/${plugin.name}/installed/personas`
let personas = await fs.readDir(GhostPath)
let _roster = window[Symbol.for('ghostRoster')]
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
console.log(plugin.statusMonitor.get('AiGhosts'))
class Roster {
    constructor() {

    }
    findGhost(
        persona
    ) {
        let name = persona.name || persona
        if (!plugin.statusMonitor.get('AiGhosts',name)) {
            let DummySys = _roster.get("DummySys")
            console.warn(`ghost of persona ${name} not found,DummySys online`)
            let ghost =DummySys.fake(name, persona.persona, persona.goal)
            plugin.statusMonitor.set('AiGhosts', name, ghost)
            return ghost
        } else {
            return plugin.statusMonitor.get('AiGhosts',name)
        }
    }
}
export default new Roster() 