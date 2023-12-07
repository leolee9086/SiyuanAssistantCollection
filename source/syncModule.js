//这里的require由插件系统的继承而来
//更进一步地,注入了插件的实例
const plugin = require("plugin")
const clientApi = require('clientApi')
function 递归合并(目标对象, 源对象) {
    if (!源对象) {
        return;
    }
    for (let 键 in 源对象) {
        if (源对象.hasOwnProperty(键)) {
            if (Object.prototype.toString.call(源对象[键]) === '[object Object]' && !源对象[键].$value && !(目标对象[键] && 目标对象[键].$value)) {
                // 如果当前属性是对象，并且源对象[键]和目标对象[键]都没有$value属性，则递归合并
                目标对象[键] = 目标对象[键] || {};
                递归合并(目标对象[键], 源对象[键]);
            } else {
                // 否则，直接复制属性值，如果有$value属性，就使用$value的值
                if (目标对象[键] === undefined) {
                    目标对象[键] = 源对象[键]
                }
                if (目标对象[键].$value !== undefined && 源对象[键].$value === undefined) {
                    目标对象[键].$value = 源对象[键]
                } else if (目标对象.$value === undefined && 源对象.$value !== undefined) {
                    目标对象[键] = 源对象[键]
                } else {
                    if (!目标对象[键].options) { 目标对象[键] = 源对象[键] }
                    else {
                        let options
                        if (源对象[键].options) {
                            options = 目标对象[键].options.concat(源对象[键].options)
                        } else {
                            options = 目标对象[键].options
                        }
                        目标对象[键] = 源对象[键]
                        if (options) {
                            目标对象[键].options = Array.from(new Set(options))
                        }
                    }
                }
            }
        }
    }
}
class PluginConfigurer {
    constructor(plugin, prop, $emit, save) {
        this.plugin = plugin
        this.plugin[prop] = this.plugin[prop] || {}
        this.emit = $emit || prop
        this.prop = prop
        this.save = save
    }
    get target() {
        return this.plugin[this.prop]
    }
    async reload() {
        for (let key in this.plugin[this.prop]) {
            let data = await this.plugin.loadData(`${key}.json`)
            try {
                递归合并(this.plugin[this.prop][key], data);
            } catch (e) {
                console.error(e)
            }
            await this.plugin.saveData(`${key}.json`, this.plugin[this.prop][key])
        }
    }

    async set(...args) {
        if (args.length < 2) {
            throw new Error('You must provide at least two arguments');
        }
        let value = args.pop();
        let path = args;
        let target = this.target;
        for (let i = 0; i < path.length - 1; i++) {
            target[path[i]] = target[path[i]] || {};
            target = target[path[i]];
        }
        // 校验新值
        let oldValue = target[path[path.length - 1]];
        console.log(value,oldValue)
        try {
            this.validateNewValue(oldValue, value);
        } catch (e) {
            this.plugin.eventBus.emit(`${this.emit}Change`, { name: path.join('.'), value: oldValue });
            throw (e)
        }
        // 如果传入的设置值为字符串或数组，且原始值有$value属性且其类型与传入值相同，将传入设置值传递给原始值的$value属性
        if ((typeof value === 'string' || Array.isArray(value)) && oldValue && oldValue.$value && typeof oldValue.$value === typeof value) {
            oldValue.$value = value;
        } else {
            target[path[path.length - 1]] = value;
        }
        this.plugin.eventBus.emit(`${this.emit}Change`, { name: path.join('.'), value });
        if (this.save) {
            await this.plugin.saveData(`${path[0]}.json`, this.target[path[0]] || {});
        }
        return this;
    }
    validateNewValue(oldValue, value) {
        // 检查旧值是否存在
        if (oldValue !== undefined) {
            // 检查旧值类型与新值类型是否相同
            if (typeof oldValue !== typeof value) {
                // 检查新值是否为字符串或数组

                if (!(typeof value === 'string' || Array.isArray(value))) {
                    // 检查旧值是否有$value属性
                    if (oldValue.$value) {
                        let $type = oldValue.$type
                        if ($type !== typeof value && $type !== value.$type && !(typeof value === 'number' && oldValue.$type === 'range')) {
                            throw new Error(`New value must be the same type as the old value. Old value: ${JSON.stringify(oldValue)}, new value: ${value}`);
                        }
                    }
                }
            }
        }
        // 检查旧值是否存在且旧值是否有$type属性
        if (oldValue && oldValue.$type) {
            // 检查新值是否没有$type属性或新值的$type与旧值的$type是否不同
            if (
                (!value.$type || oldValue.$type !== value.$type) && !(typeof value === 'string' || Array.isArray(value) || typeof value === oldValue.$type || typeof oldValue === value.$type || typeof value === 'number' && oldValue.$type === 'range')) {
                throw new Error(`New value must have the same $type as the old value. Old value: ${oldValue}, new value: ${value}`);
            }
        }
        // 检查新值是否有$value属性
        if (value.$value) {
            // 检查新值是否没有$type属性
            if (!value.$type) {
                throw new Error(`The $value of the new value must have a $type. Old value: ${oldValue}, new value: ${value}`);
            }
            // 检查新值的$value是否不是字符串也不是数组
            else if (typeof value.$value !== 'string' && !Array.isArray(value.$value)) {
                throw new Error(`The $value of the new value must be a string or array. Old value: ${oldValue}, new value: ${value}`);
            }
        }
        // 当新旧值都有$value与$type属性时，新值所有属性必须与旧值所有属性类型一致（允许为undefined）
        if (oldValue && oldValue.$value && oldValue.$type && value.$value && value.$type) {
            for (let key in oldValue) {
                if (typeof oldValue[key] !== typeof value[key] && value[key] !== undefined) {
                    throw new Error(`New value's ${key} must be the same type as the old value's ${key}. Old value: ${oldValue[key]}, new value: ${value[key]}`);
                }
            }
        }
    }
    get(...args) {
        let target = this.target;
        for (let i = 0; i < args.length; i++) {
            if (target[args[i]] === undefined) {
                const undefinedFunction = () => { return undefined };
                undefinedFunction.$value = undefined;
                return undefinedFunction;
            }
            target = target[args[i]];
        }
        const getterFunction = (nextArg) => this.get(...args, nextArg);
        if (typeof target === 'object' && target.hasOwnProperty('$value')) {
            getterFunction.$value = target.$value;
            getterFunction.$raw = target;

        } else {
            getterFunction.$value = target;
            getterFunction.$raw = target;
        }
        return getterFunction;
    }
    generatePaths(obj, currentPath = '') {
        let paths = [];
        for (let key in obj) {
            let newPath = currentPath ? `${currentPath}.${key}` : key;
            if (Array.isArray(obj[key])) {
                for (let subKey of obj[key]) {
                    paths.push(`${newPath}.${subKey}`);
                }
                if (obj[key].length === 0) {
                    paths.push(newPath);
                }
            } else if (typeof obj[key] === 'object' && obj[key].hasOwnProperty('$value') && obj[key].$type) {
                paths.push(newPath);
            } else if (typeof obj[key] === 'object' && obj[key].hasOwnProperty('$value')) {
                paths.push(newPath);
            }
            else if (typeof obj[key] === 'object' && Object.keys(obj[key]).length !== 0) {
                paths = paths.concat(this.generatePaths(obj[key], newPath));
            } else {
                paths.push(newPath);
            }
        }
        return paths;
    }
    recursiveQuery(path, base = '') {
        let fullPath = base ? `${base}.${path}` : path;
        let value = this.get(...(fullPath.split('.'))).$value;
        if (typeof value === 'object' && value !== null && !(value instanceof Array) && !(value.$value)) {
            return Object.keys(value).reduce((result, key) => {
                let subPath = `${path}.${key}`;
                let subValue = this.recursiveQuery(subPath, base);
                if (Array.isArray(subValue)) {
                    result = result.concat(subValue);
                } else {
                    result.push({ path: subPath, value: subValue });
                }
                return result;
            }, []);
        } else {
            return [{ path: fullPath, value: value }];
        }
    }
    query(fields, base = '') {
        let paths = this.generatePaths(fields);
        let data = paths.reduce((result, element) => {
            let subData = this.recursiveQuery(element, base);
            return result.concat(subData);
        }, []);
        data.forEach(obj => {
            if (obj.value === undefined) {
                obj.error = `属性路径${obj.path}不存在,请检查设置和查询参数`
            }
        });
        return data;
    }
    list() {
        return this.target
    }
}
plugin.statusMonitor = new PluginConfigurer(plugin, 'status')
plugin.configurer = new PluginConfigurer(plugin, '_setting', 'setting', true)
//这里开始加载需要同步进行的事件
//没什么别的作用,就是用来收集protyle而已
const { eventBus } = plugin
eventBus.on("loaded-protyle", (e) => {
    plugin.protyles.push(e.detail);
    plugin.protyles = Array.from(new Set(this.protyles));
    plugin.setLute ? plugin._lute = plugin.setLute({
        emojiSite: e.detail.options.hint.emojiPath,
        emojis: e.detail.options.hint.emoji,
        headingAnchor: false,
        listStyle: e.detail.options.preview.markdown.listStyle,
        paragraphBeginningSpace: e.detail.options.preview.markdown.paragraphBeginningSpace,
        sanitize: e.detail.options.preview.markdown.sanitize,
    }) : null;
});
//适配新版本
eventBus.on("loaded-protyle-static", (e) => {
    plugin.protyles.push(e.detail);
    plugin.protyles = Array.from(new Set(plugin.protyles));
    try {
        plugin.setLute ? plugin._lute = plugin.setLute({
            emojiSite: e.detail.options.hint.emojiPath,
            emojis: e.detail.options.hint.emoji,
            headingAnchor: false,
            listStyle: e.detail.options.preview.markdown.listStyle,
            paragraphBeginningSpace: e.detail.options.preview.markdown.paragraphBeginningSpace,
            sanitize: e.detail.options.preview.markdown.sanitize,
        }) : null;
    } catch (e) {
        console.warn(e, e.detail)
    }
});
eventBus.on("click-editorcontent", (e) => {
    plugin.protyles.push(e.detail.protyle);
    plugin.protyles = Array.from(new Set(plugin.protyles));
})
