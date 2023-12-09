import { Url } from "../../searchers/websearchers/rssLoader/url.js";
import fs from "../../polyfills/fs.js";
// 使用 fetch API 来加载模块代码
export async function fetchModule(modulePath, baseURL, module, require) {
  let base = new Url(baseURL)
  console.log(base.resolve(modulePath))
  const code = await fs.readFile(base.resolve(modulePath))
  // 创建一个新的函数，这个函数将模块代码包装在一个函数中
  const functionBody = `
      (function(require, module, exports) {
        ${code}
      })
    `;
  // 创建一个新的 require 函数，这个函数用于加载其他模块
  const requireOtherModule = (otherModulePath) => require(Url.resolve(otherModulePath, baseURL));
  // 执行模块代码
  const functionWrapper = eval(functionBody);
  functionWrapper(requireOtherModule, module, module.exports);
}