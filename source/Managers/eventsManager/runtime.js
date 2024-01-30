import { plugin,Constants,kernelApi,clientApi } from "../../asyncModules.js";
//import { 渲染块标菜单 as 渲染动作块标菜单 } from "../UI/menus/menuWrapper.js";
//import { setSync } from "../fileSysManager/index.js";
import path from '../../polyfills/path.js';
import fs from "../../polyfills/fs.js";
//import buildMenu from "../UI/dialogs/fakeMenu.js";
//import { string2DOM } from "../UI/builders/index.js";
//import roster from '../throne/ghostDomain/index.js'
//import marduk from '../throne/index.js'
//所以问题还是在事件管理器的依赖混乱上
export {
    plugin,
    Constants,
    kernelApi,
    clientApi,
    path,
    fs,
    plugin as sac
}