const cache = {
    data: new Map(),
    tryGet: async function (key, fallbackFunction) {
        try {
            if (!this.data.has(key)) {
                this.data.set(key, await fallbackFunction());
            }
        } catch (e) {
            console.warn(e)
        }
        return this.data.get(key);
    },
    set: function (key, value) {
        this.data.set(key, value);
    },
    get: function (key) {
        return this.data.get(key);
    }
}
const mocCtx = (url) => {
    const ctx = {
        host:globalThis.location.host,
        originalUrl : url,
        method: 'GET',
        path:url,
        request: {
            url: url,
            method: 'GET',
            // 其他请求属性...
        },
        response: {
            // 响应属性...
        },
        state: {},
        query:{},
        cache,
    };
    return ctx
}
export default mocCtx