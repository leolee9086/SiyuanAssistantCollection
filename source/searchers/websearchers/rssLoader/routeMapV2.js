import { plugin } from "../../../asyncModules.js";
import fs from "../../../polyfills/fs.js";
import path from '../../../polyfills/path.js'

let rssV2Path = path.join(plugin.selfPath, 'installed', 'rssV2')
let moduleList = await fs.readDir(rssV2Path)
let routeMap = {}

moduleList = moduleList.filter(
    item => {
        return item.isDir
    }
).map(
    item => {
        return item.name
    }
)

for (let name of moduleList) {
    routeMap[name] = {}
    let routerPath = path.join(rssV2Path, name, 'router.js')
    if (await fs.exists(routerPath)) {
        let _router = {}
        _router.get = (scheme, _path) => {
            routeMap[name][scheme] = routeMap[name][scheme] || {}
            routeMap[name][scheme].get = _path
        }
        _router.redirect = (scheme, _path) => {
            routeMap[name][scheme] = routeMap[name][scheme] || {}
            routeMap[name][scheme].redirect = _path
        }
        let code = await fs.readFile(routerPath)

        const exportsObj = {};
        const moduleObj = {
            exports: exportsObj
        };
        code = "(function anonymous(module, exports,path){".concat(`let require=(key) => {
            return path.join('${rssV2Path}', '${name}', key+'.js')
        };`, code, "\n return module.exports})\n//# sourceURL=").concat(routerPath, "\n")
        let _module = (window.eval(code))(moduleObj, exportsObj, path)
        try {
            _module(_router)
        } catch (e) {
            console.warn(e)
        }
    }
}

export default routeMap 
