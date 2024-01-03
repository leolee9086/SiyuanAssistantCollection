import Router from "./routerPolyfill.js";
import { plugin } from '../../../../asyncModules.js';
import fs from '../../../../polyfills/fs.js';
import path from '../../../../polyfills/path.js'
import { 柯里化 } from '../../../../utils/functionTools.js'
import moduleCache from "./moduleCache.js";
import routeMapV2 from "./routeMapV2.js"
import { logger } from "../../../../logger/index.js";
const getObject = (currentFile, key) => {
    const api = moduleCache
    // 如果 key 是一个相对路径，解析它
    if (key.startsWith('./') || key.startsWith('../')) {
        key = path.resolve(path.dirname(currentFile), key)
        if(!key.endsWith('.js')){
            key=key+'.js'
        }
    }
    if (api[key]) {
        if (api[key]['esm']) {
            return api[key]['esm']
        } else if (api[key]['cjs']) {
            return api[key]['cjs']
        }
        return api[key]
    } else if (key.startsWith('/data')) {
         loadRSS(key)
        return api[key]
    }
};
const _require = 柯里化(getObject)
export const loadRSS = async (sourceURL) => {
    try {
        const __dirname=path.dirname(sourceURL)
        console.log(__dirname)
        if (moduleCache[sourceURL]) {
            return moduleCache[sourceURL]
        }
        let code = await fs.readFile(sourceURL)
        const exportsObj = {};
        const moduleObj = {
            exports: exportsObj
        };
        const requireRegex = /require\(['"](.+?)['"]\)/g;
        let match;
        while ((match = requireRegex.exec(code)) !== null) {
            const requirePath = match[1];
            // 如果是相对路径，进行预加载
            if (requirePath.startsWith('./') || requirePath.startsWith('../')) {
                let absolutePath = path.resolve(path.dirname(sourceURL), requirePath);
                if(!absolutePath.endsWith('.js')){
                    absolutePath=absolutePath+'.js'
                }
                if (!moduleCache[absolutePath]) {
                    await loadRSS(absolutePath);
                }
            }
        }
        code = "(function anonymous(require, module, exports,__dirname){".concat(code, "\n return module.exports})\n//# sourceURL=").concat(sourceURL, "\n")
        let _module = (window.eval(code))(_require(sourceURL), moduleObj, exportsObj,__dirname)
        moduleCache[sourceURL] = _module
        return _module
    } catch (e) {
        throw e; // 抛出错误，以便在 loadAll 函数中处理
    }
}

const loadAll = async () => {
    let router = {}
    let successList = [];
    let failureList = [];
    try {
        let list = await fs.readDir(plugin.selfPath + '/installed/rss')
        for (let element of list) {
            if (element.isDir) {
                router[element.name] = {}
                let rssFiles = await fs.readDir(plugin.selfPath + '/installed/rss/' + element.name)
                for (let file of rssFiles) {
                    if (file.name.endsWith('.js')) {
                        try {
                            router[element.name][file.name.split('.')[0]] = await loadRSS(plugin.selfPath + '/installed/rss/' + element.name + '/' + file.name)
                            successList.push(element.name + '/' + file.name);
                        } catch (e) {
                            logger.rsserror(`Error loading RSS from ${element.name + '/' + file.name}:`, e)
                            failureList.push(element.name + '/' + file.name);
                        }
                    }
                }
            }
        }
    } catch (e) {
        logger.rsserror('Error reading directory:', e)
    }
    logger.rsslog(`Successfully loaded ${successList.length} RSS:`, successList);
    logger.rsslog(`Failed to load ${failureList.length} RSS:`, failureList);
    return router
}
const router = new Router();
// 懒加载 Route Handler，Route 首次被请求时才会 解析 相关文件
export const lazyloadRouteHandler = (routeHandlerPath) => {
    let realPath = routeHandlerPath.replace('./routes', '/public/sac-rss-adapter/installed/rss')
    if (!realPath.endsWith('.js')) {
        realPath = realPath + '.js'
    }
    let func= async (ctx, next) => {
        if (!(moduleCache[realPath] instanceof Function)) {
            await loadRSS(realPath);
        }
        if (moduleCache[realPath] instanceof Function) {
            await moduleCache[realPath](ctx);
        }
        next();
    }
    func.$routeHandlerPath=routeHandlerPath
    return func
}
/*Object.getOwnPropertyNames(routeMapV2).forEach(
    name => {
        try {
            let subRouter = new Router()
            let define = routeMapV2[name]
            for (let route in define) {
                for (let method in define[route]) {
                    let realPath = define[route][method]
                    if (realPath instanceof Function) {
                        subRouter[method](route, realPath)

                    } else {
                        subRouter[method](route, lazyloadRouteHandler(realPath))

                    }
                }
            }
            router.use(`/${name}`, subRouter.routes())
        } catch (e) {
            logger.rsswarn(e)
        }
    }
)*/
//await (await import('../../../../../installed/rss/router.js')).default(router,lazyloadRouteHandler)
export default router;
