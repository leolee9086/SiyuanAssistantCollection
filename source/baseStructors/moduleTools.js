let 模块注册表 = {};

function 转化模块为类(module) {
    return class {
        constructor() {
            // 将模块的函数转化为类的方法
            for (let key in module) {
                if (typeof module[key] === 'function') {
                    this[key] = module[key].bind(this);
                }
            }
            // 将模块的对象转化为类的属性
            for (let key in module) {
                if (typeof module[key] !== 'function') {
                    this[key] = module[key];
                }
            }
        }
    };
}
async function 作为类导入(moduleURL, cjs) {
    // 如果这个模块已经被导入过，直接从注册表中返回
    if (模块注册表[moduleURL]) {
        return 模块注册表[moduleURL];
    }

    // 否则，导入这个模块并转化为类
    let module = await import(moduleURL);
    let 类 = 转化模块为类(module);

    // 将这个类添加到注册表中
    模块注册表[moduleURL] = 类;

    return 类;
}