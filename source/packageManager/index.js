import { 下载基础模型 } from "./models.js";
import { 解压依赖 } from './dependencies.js'
export { 下载基础模型 as 下载基础模型 }
export { 解压依赖 as 解压依赖 }
import { runPnpmCommand } from "./adapters/NPM.js";
runPnpmCommand('install 啊啊啊啊啊啊啊2123123')
    .then(stdout => {
        console.log(`pnpm version: ${stdout}`);
    })
    .catch(error => {
        console.error(`Error: ${error}`);
    });