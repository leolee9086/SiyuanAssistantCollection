class 组合继承 {
    继承方法(来源, 方法名) {
        if (typeof 来源[方法名] === 'function') {
            this[方法名] = 来源[方法名].bind(来源);
        } else {
            throw new Error(`方法 ${方法名} 不存在于来源对象中。`);
        }
    }

    解耦继承属性(来源, 属性名) {
        if (来源.hasOwnProperty(属性名)) {
            let _value = 来源[属性名];  // 初始值来自来源对象的属性
            Object.defineProperty(this, 属性名, {
                get: () => _value,
                set: (value) => { _value = value; },
                enumerable: true,
                configurable: true
            });
        } else {
            throw new Error(`属性 ${属性名} 不存在于来源对象中。`);
        }
    }

    合并继承(来源) {
        for (let key in 来源) {
            if (typeof 来源[key] === 'function') {
                this.继承方法(来源, key);
            } else {
                this.解耦继承属性(来源, key);
            }
        }
    }

    批量继承方法(来源, 方法名数组) {
        for (let 方法名 of 方法名数组) {
            this.继承方法(来源, 方法名);
        }
    }

    批量解耦继承属性(来源, 属性名数组) {
        for (let 属性名 of 属性名数组) {
            this.解耦继承属性(来源, 属性名);
        }
    }
}

function 继承方法(目标, 来源, 方法名) {
    if (typeof 来源[方法名] === 'function') {
        目标[方法名] = 来源[方法名].bind(来源);
    } else {
        throw new Error(`方法 ${方法名} 不存在于来源对象中。`);
    }
}

function 解耦继承属性(目标, 来源, 属性名) {
    if (来源.hasOwnProperty(属性名)) {
        let _value = 来源[属性名];  // 初始值来自来源对象的属性
        Object.defineProperty(目标, 属性名, {
            get: () => _value,
            set: (value) => { _value = value; },
            enumerable: true,
            configurable: true
        });
    } else {
        throw new Error(`属性 ${属性名} 不存在于来源对象中。`);
    }
}