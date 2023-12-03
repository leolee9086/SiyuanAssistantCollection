import logger from '../../../../logger/index.js'

const handler = {
    get: function(target, prop, receiver) {
        if (typeof target[prop] === 'function') {
            return function(...args) {
                return target['rss' + prop.charAt(0).toUpperCase() + prop.slice(1)](...args);
            };
        }
        return Reflect.get(...arguments);
    }
};

const proxyLogger = new Proxy(logger, handler);

export default proxyLogger;