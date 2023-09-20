//import * as jieba from '../static/jieba_rs_wasm.js'
//await jieba.default(import.meta.resolve(`../static/jieba_rs_wasm_bg.wasm`));

import kernelApi from './polyfills/kernelApi.js';
let pluginName  = import.meta.resolve('../').split('/').filter(item=>{return item}).pop()
let pluginInstance=globalThis[Symbol.for(`plugin_${pluginName}`)]
let clientApiInstance=globalThis[Symbol.for(`clientApi`)]
export {clientApiInstance as clientApi}
export {pluginInstance as pluginInstance}
export {pluginInstance as plugin}
export {kernelApi as kernelApi}