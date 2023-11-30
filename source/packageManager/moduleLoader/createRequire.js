import { importModule } from "./esmLoader.js";
import { fetchModule } from "./cjsLoader.js";
// 创建一个全局的模块缓存
// 创建一个全局的模块缓存
const globalModuleCache = {};
// 创建一个集合来跟踪正在加载的模块
const loadingModules = new Set();
// 创建一个新的模块对象，并将它添加到缓存中
function createModule(modulePath, moduleCache) {
  const module = { exports: {} };
  moduleCache[modulePath] = module;
  return module;
}
// 使用通用的模块加载函数来加载模块
async function loadAndExecuteModule(modulePath, baseURL, module, require, loader, fallbackLoader) {
  try {
    await loader(modulePath, baseURL, module);
  } catch (error) {
    await fallbackLoader(modulePath, baseURL, module, require);
  }
  return module.exports;
}
export const createRequire = (baseURL, moduleCache = globalModuleCache) => {
  const require = async (modulePath) => {
    // 如果模块已经在缓存中，直接返回
    if (moduleCache[modulePath]) {
      return moduleCache[modulePath].exports;
    }
    // 如果模块正在加载中，直接返回模块对象
    if (loadingModules.has(modulePath)) {
      return moduleCache[modulePath];
    }
    // 创建一个新的模块对象，并将它添加到缓存中
    const module = createModule(modulePath, moduleCache);
    // 添加模块到正在加载的模块集合中
    loadingModules.add(modulePath);
    // 使用通用的模块加载函数来加载模块
    const exports = await loadAndExecuteModule(modulePath, baseURL, module, require, importModule, fetchModule);
    // 从正在加载的模块集合中移除模块
    loadingModules.delete(modulePath);
    return exports;
  };
  return require;
};