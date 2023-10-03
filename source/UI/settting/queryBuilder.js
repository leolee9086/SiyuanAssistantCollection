import { isValidJSON,isValidSetting } from "./isValid.js";
export class JSONQueryBuilder {
    constructor(targetObject, changeCallback, getListerner) {
        this.targetObject = targetObject;
        this.changeCallback = changeCallback;
        this.getListerner = getListerner;
        if(!isValidJSON(targetObject)){
            throw new Error('对象并非一个合适的JSON对象')
        }
    }
    // Private method
    _generatePaths(obj, currentPath = '') {
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
            } else if (typeof obj[key] === 'object' && Object.keys(obj[key]).length !== 0) {
                paths = paths.concat(this._generatePaths(obj[key], newPath));
            } else {
                paths.push(newPath);
            }
        }
        return paths;
    }
    // Private method
    _recursiveQuery(path, base = '') {
        let fullPath = base ? `${base}.${path}` : path;
        let value = this.get(...(fullPath.split('.'))).$value;
        if (typeof value === 'object' && value !== null && !(value instanceof Array)) {
            return Object.keys(value).reduce((result, key) => {
                let subPath = `${path}.${key}`;
                let subValue = this._recursiveQuery(subPath, base);
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
        let paths = this._generatePaths(fields);
        let data = paths.reduce((result, element) => {
            let subData = this._recursiveQuery(element, base);
            return result.concat(subData);
        }, []);
        data.forEach(obj => {
            if (obj.value === undefined) {
                obj.error = `属性路径${obj.path}不存在,请检查设置和查询参数`
            }
        });
        return data;
    }
    get(...args) {
        let target = this.targetObject;
        for (let i = 0; i < args.length; i++) {
            if (target[args[i]] === undefined) {
                throw new Error(`Path "${args.join('.')}" does not exist in the target object.`);
            }
            target = target[args[i]];
        }
        const getterFunction = (nextArg) => this.get(...args, nextArg);
        getterFunction.$value = target;
        return getterFunction;
    }
    async set(...args) {
        if (args.length < 2) {
            throw new Error('You must provide at least two arguments');
        }
        let value = args.pop();
        let path = args;
        let target = this.targetObject;
        for (let i = 0; i < path.length - 1; i++) {
            if (target[path[i]] === undefined) {
                throw new Error(`Path "${path.slice(0, i + 1).join('.')}" does not exist in the target object.`);
            }
            target = target[path[i]];
        }
        // Check if the type of the value is the same as the type of the current value at the target location
        if (typeof target[path[path.length - 1]] !== typeof value) {
            throw new Error(`Type of the provided value ("${typeof value}") does not match the type of the current value ("${typeof target[path[path.length - 1]]}") at the target location.`);
        }
        target[path[path.length - 1]] = value;
        this.changeCallback(this.targetObject, { name: path.join('.'), value });
        return this;
    }
}
