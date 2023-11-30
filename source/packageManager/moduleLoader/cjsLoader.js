// 使用 fetch API 来加载模块代码
export async function fetchModule(modulePath, baseURL, module, require) {
    const response = await fetch(new URL(modulePath, baseURL));
    const code = await response.text();
    // 创建一个新的函数，这个函数将模块代码包装在一个函数中
    const functionBody = `
      (function(require, module, exports) {
        ${code}
      })
    `;
    // 创建一个新的 require 函数，这个函数用于加载其他模块
    const requireOtherModule = (otherModulePath) => require(new URL(otherModulePath, baseURL));
    // 执行模块代码
    const functionWrapper = eval(functionBody);
    functionWrapper(requireOtherModule, module, module.exports);
  }