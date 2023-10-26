import fs from "../../polyfills/fs.js";
globalThis.siyuan={}
globalThis.siyuan.config =JSON.parse(await fs.readFile('/conf/conf.json'))
console.log(globalThis.siyuan.config)