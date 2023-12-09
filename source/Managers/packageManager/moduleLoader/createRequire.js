import fs from "../../polyfills/fs.js";
import path from "../../polyfills/path.js";
import { 柯里化 } from "../../baseStructors/functionTools.js";
const severMap = {
  '/data/plugins': '/plugins',
  '/data/widgets': '/widgets',
  '/data/snippets': '/snippets',
}
export function path2ServerURL(path) {
  for (let key in severMap) {
    if (path.startsWith(key)) {
      return path.replace(key, severMap[key]);
    }
  }
  return path;
}
export function serverURL2Path(serverURL) {
  for (let key in severMap) {
    if (serverURL.startsWith(severMap[key])) {
      return serverURL.replace(severMap[key], key);
    }
  }
  return serverURL;
}
export function getPathInfo(path) {
  return {
    serverPath: serverURL2Path(path),
    serverURL: path2ServerURL(path)
  };
}
export async function fetchInternalFile(path) {
  let { serverURL } = getPathInfo(path)
  return await fetch(serverURL)
}
export async function readInternalFile(path) {
  let { serverPath } = getPathInfo(path)
  return fs.readFile(serverPath)
}
export async function readInternalDir(path) {
  let { serverPath } = getPathInfo(path)
  return fs.readDir(serverPath)
}
export async function globInternalDir(dir, _modulePaths) {
  let modulePaths = _modulePaths || []
  let list = await fs.readDir(dir);
  for (const entry of list) {
    let fullPath = path.join(dir, entry.name);
    if (entry.isDir) {
      await glob(fullPath);
    } else {
      modulePaths.push(fullPath);
    }
  }
  return modulePaths
}
const createRequire = (moduleCache,options={}) => {
  let {resolve} =options
  return (currentFile, key) => {
    for (let prefix in resolve) {
      if (key.startsWith(prefix)) {
        key = key.replace(prefix, resolve[prefix]);
      }
    }
  
    if (key.startsWith('./') || key.startsWith('../')) {
      key = path.resolve(path.dirname(currentFile), key) ;
    }
    if (moduleCache[key]) {
      return moduleCache[key];
    } else {
      try {
        return loadCjs(key,moduleCache,options)
      } catch (e) {
        console.warn(currentFile, key, e)
      }
    }
  }
}
const loadCjs = async (sourceURL,moduleCache,options) => {
  let {resolve} =options
  for (let prefix in resolve) {
    if (sourceURL.startsWith(prefix)) {
      sourceURL = sourceURL.replace(prefix, resolve[prefix]);
      break;
    }
  }

  let _require= 柯里化(createRequire(moduleCache,options))
  let code = await(await fetch(sourceURL)).text()
  const exportsObj = {};
  const moduleObj = {
      exports: exportsObj
  };
  code = "(function anonymous(require, module, exports){".concat(code, "\n return module.exports})\n//# sourceURL=").concat(sourceURL, "\n")
  try {
      return (window.eval(code))(_require(sourceURL), moduleObj, exportsObj)
  } catch (e) {
      throw e; // 抛出错误，以便在 loadAll 函数中处理
  }
}
export const createInternalRequire = async (internalPath, base = '/', moduleCache = {},options={}) => {
  let list = await globInternalDir(path.join(base, internalPath))
  for (let fileName of list) {
    moduleCache[fileName]={}
    try {
      let module = await import(getPathInfo(fileName).serverURL)
      moduleCache[fileName]['esm'] = module
    } catch (e) {
      moduleCache[fileName]['esmError'] = e
    }
    try {
      let module = await loadCjs(getPathInfo(fileName).serverURL,moduleCache,options)
      moduleCache[fileName]['cjs'] = module
    } catch (e) {
      moduleCache[fileName]['cjsError'] = e
    }
  }
  return moduleCache
}