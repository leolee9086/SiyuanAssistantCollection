class 别名可用 {
    constructor() {
        this.设置别名('设置别名', 'setAlias');
        this.设置别名('批量设置别名', 'setAliases');
        this.设置别名('递归设置别名', 'setAliasesRecursively');
    }

    设置别名(原名, 别名) {
        if (this.hasOwnProperty(别名)) {
            throw new Error(`别名 ${别名} 已经存在，不要覆盖它。`);
        }
        Object.defineProperty(this, 别名, {
            get: () => this[原名],
            set: (value) => { this[原名] = value; },
            enumerable: true,
            configurable: true
        });
    }

    批量设置别名(别名字典) {
        for (let 原名 in 别名字典) {
            let 别名列表 = 别名字典[原名];
            if (!Array.isArray(别名列表)) {
                别名列表 = [别名列表];
            }
            for (let 别名 of 别名列表) {
                this.设置别名(原名, 别名);
            }
        }
    }

    递归设置别名(别名字典, 目标对象 = this) {
        for (let 原名 in 别名字典) {
            let 别名列表 = 别名字典[原名];
            if (!Array.isArray(别名列表)) {
                别名列表 = [别名列表];
            }
            for (let 别名 of 别名列表) {
                if (typeof 目标对象[原名] === 'object' && 目标对象[原名] !== null) {
                    this.递归设置别名(别名字典, 目标对象[原名]);
                } else {
                    this.设置别名(原名, 别名);
                }
            }
        }
    }
}