//only是一个只有一个函数的库,所以这里直接包含它
export default function only(obj, keys) {
    obj = obj || {};
    if ('string' == typeof keys) keys = keys.split(/ +/);
    return keys.reduce(function (ret, key) {
        if (null == obj[key]) return ret;
        ret[key] = obj[key];
        return ret;
    }, {});
};