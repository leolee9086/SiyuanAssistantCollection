import * as Vue from '../../static/vue.esm-browser.js'
import { loadModule } from '../../static/vue3-sfc-loader.esm.js'
import * as runtime from '../asyncModules.js';
const options = {
    moduleCache: {
        vue: Vue,
        runtime: runtime
    },
    async getFile(url) {
        url = url.split('@@@')[0]+'.vue'
        const res = await fetch(url);
        if (!res.ok)
            throw Object.assign(new Error(res.statusText + ' ' + url), { res });
        return {
            getContentData: asBinary => asBinary ? res.arrayBuffer() : res.text(),
        }
    },
    addStyle(textContent) {
        const style = Object.assign(document.createElement('style'), { textContent });
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(style, ref);
    },
}
let watched = {}
export const initVueApp = (appURL, name, mixinOptions = {}, path) => {
    let oldApp
    let _args
    let f = () => {
        oldApp?oldApp.unmount:null
        let obj = { ...options, ...mixinOptions }
        let componentsCache = {}
        appURL= appURL.replace('.vue',`@@@${Date.now()}.vue`)
        componentsCache[name] = Vue.defineAsyncComponent(() => loadModule(appURL, obj))
        let app = Vue.createApp({
            components: componentsCache,
            template: `<${name}></${name}>`
        })
        if (window.require && path) {
            watched[path] = true
            let _mount = app.mount
            app.mount = (...args) => {
                _args = args;
                _mount.bind(app)(...args)
            }
        }
        return app
    }
    oldApp=f()
    path&&require('fs').watch(path, { recursive: true }, (type) => {
        if (type == 'change' && _args) {
            oldApp.unmount()
            oldApp = f()
            oldApp.mount(..._args)
        }
    })
    return oldApp
}
