import { pathToRegexp } from '../../../static/path-to-regexp.js'
import { compose } from './routerUtils.js'
let Errors={
    NotImplemented:()=>{
        return new Error('not implemented')
    },
    MethodNotAllowed:()=>{
        return new Error('method not allowed')
    }
}
const HttpError = Errors
const methods =   [
    'get',
    'post',
    'put',
    'head',
    'delete',
    'options',
    'trace',
    'copy',
    'lock',
    'mkcol',
    'move',
    'purge',
    'propfind',
    'proppatch',
    'unlock',
    'report',
    'mkactivity',
    'checkout',
    'merge',
    'm-search',
    'notify',
    'subscribe',
    'unsubscribe',
    'patch',
    'search',
    'connect'
  ];

import  Layer from './layer.js'
const debug = (...args)=>{
//    console.log(...args)
}
/**
 * Router constructor function.
 *
 * @param {Object} opts - Configuration options for the router. 
 * @param {Array} [opts.methods=['HEAD', 'OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE']] - HTTP methods that the router should respond to.
 * @param {boolean} [opts.exclusive=false] - If true, the router will only respond to the most specific matching route for a given URL.
 * @param {Object} [opts.params={}] - An object to hold parameter value functions to be run when a particular parameter is present in the route.
 * @param {Array} [opts.stack=[]] - An array to hold middleware and routes.
 * @param {string} [opts.host] - The host that the router should respond to.
 * @returns {Router} A new Router instance.
 */
// 使用默认参数定义Router函数
export default function Router(opts = {}) {
    // 如果函数的调用者不是Router的实例，则创建一个新的Router实例
    if (!(this instanceof Router)) return new Router(opts);
    
    // 将传入的选项赋值给this.opts
    this.opts = opts;
    
    // 如果传入的选项中包含methods，则使用传入的methods，否则使用默认的HTTP方法
    this.methods = this.opts.methods || [
        'HEAD',
        'OPTIONS',
        'GET',
        'PUT',
        'PATCH',
        'POST',
        'DELETE'
    ];
    
    // 如果传入的选项中包含exclusive，则将其转换为布尔值并赋值给this.exclusive
    this.exclusive = Boolean(this.opts.exclusive);
    // 初始化params为空对象
    this.params = {};
    // 初始化stack为空数组
    this.stack = [];
    // 如果传入的选项中包含host，则将其赋值给this.host
    this.host = this.opts.host;
}

for (const method_ of methods) {
    function setMethodVerb(method) {
        Router.prototype[method] = function (name, path, middleware) {
            if (typeof path === 'string' || path instanceof RegExp) {
                middleware = Array.prototype.slice.call(arguments, 2);
            } else {
                middleware = Array.prototype.slice.call(arguments, 1);
                path = name;
                name = null;
            }
            if (
                typeof path !== 'string' &&
                !(path instanceof RegExp) &&
                (!Array.isArray(path) || path.length === 0)
            )
                throw new Error(
                    `You have to provide a path when adding a ${method} handler`
                );
            this.register(path, [method], middleware, { name });
            return this;
        };
    }
    setMethodVerb(method_);
}
Router.prototype.del = Router.prototype['delete'];
Router.prototype.use = function () {
    const router = this;
    const middleware = Array.prototype.slice.call(arguments);
    let path;
    if (Array.isArray(middleware[0]) && typeof middleware[0][0] === 'string') {
        const arrPaths = middleware[0];
        for (const p of arrPaths) {
            router.use.apply(router, [p].concat(middleware.slice(1)));
        }
        return this;
    }
    const hasPath = typeof middleware[0] === 'string';
    if (hasPath) path = middleware.shift();
    for (const m of middleware) {
        if (m.router) {
            const cloneRouter = Object.assign(
                Object.create(Router.prototype),
                m.router,
                {
                    stack: [...m.router.stack]
                }
            );
            for (let j = 0; j < cloneRouter.stack.length; j++) {
                const nestedLayer = cloneRouter.stack[j];
                const cloneLayer = Object.assign(
                    Object.create(Layer.prototype),
                    nestedLayer
                );
                if (path) cloneLayer.setPrefix(path);
                if (router.opts.prefix) cloneLayer.setPrefix(router.opts.prefix);
                router.stack.push(cloneLayer);
                cloneRouter.stack[j] = cloneLayer;
            }

            if (router.params) {
                function setRouterParams(paramArr) {
                    const routerParams = paramArr;
                    for (const key of routerParams) {
                        cloneRouter.param(key, router.params[key]);
                    }
                }

                setRouterParams(Object.keys(router.params));
            }
        } else {
            const keys = [];
            pathToRegexp(router.opts.prefix || '', keys);
            const routerPrefixHasParam = router.opts.prefix && keys.length;
            router.register(path || '([^/]*)', [], m, {
                end: false,
                ignoreCaptures: !hasPath && !routerPrefixHasParam
            });
        }
    }

    return this;
};
Router.prototype.prefix = function (prefix) {
    prefix = prefix.replace(/\/$/, '');

    this.opts.prefix = prefix;

    for (let i = 0; i < this.stack.length; i++) {
        const route = this.stack[i];
        route.setPrefix(prefix);
    }

    return this;
};

Router.prototype.routes = Router.prototype.middleware = function () {
    const router = this;

    const dispatch = function dispatch(ctx, next) {
        debug('%s %s', ctx.method, ctx.path);

        const hostMatched = router.matchHost(ctx.host);

        if (!hostMatched) {
            return next();
        }

        const path =
            router.opts.routerPath || ctx.newRouterPath || ctx.path || ctx.routerPath;
        const matched = router.match(path, ctx.method);
        let layerChain;

        if (ctx.matched) {
            ctx.matched.push.apply(ctx.matched, matched.path);
        } else {
            ctx.matched = matched.path;
        }

        ctx.router = router;

        if (!matched.route) return next();

        const matchedLayers = matched.pathAndMethod;
        const mostSpecificLayer = matchedLayers[matchedLayers.length - 1];
        ctx._matchedRoute = mostSpecificLayer.path;
        if (mostSpecificLayer.name) {
            ctx._matchedRouteName = mostSpecificLayer.name;
        }

        layerChain = (
            router.exclusive ? [mostSpecificLayer] : matchedLayers
        ).reduce(function (memo, layer) {
            memo.push(function (ctx, next) {
                ctx.captures = layer.captures(path, ctx.captures);
                ctx.params = ctx.request.params = layer.params(
                    path,
                    ctx.captures,
                    ctx.params
                );
                ctx.routerPath = layer.path;
                ctx.routerName = layer.name;
                ctx._matchedRoute = layer.path;
                if (layer.name) {
                    ctx._matchedRouteName = layer.name;
                }

                return next();
            });
            return memo.concat(layer.stack);
        }, []);

        return compose(layerChain)(ctx, next);
    };
    dispatch.router = this;
    return dispatch;
};
Router.prototype.allowedMethods = function (options = {}) {
    const implemented = this.methods;
    return function allowedMethods(ctx, next) {
        return next().then(function () {
            const allowed = {};
            if (!ctx.status || ctx.status === 404) {
                for (let i = 0; i < ctx.matched.length; i++) {
                    const route = ctx.matched[i];
                    for (let j = 0; j < route.methods.length; j++) {
                        const method = route.methods[j];
                        allowed[method] = method;
                    }
                }
                const allowedArr = Object.keys(allowed);
                if (!~implemented.indexOf(ctx.method)) {
                    if (options.throw) {
                        const notImplementedThrowable =
                            typeof options.notImplemented === 'function'
                                ? options.notImplemented() // set whatever the user returns from their function
                                : new HttpError.NotImplemented();

                        throw notImplementedThrowable;
                    } else {
                        ctx.status = 501;
                        ctx.set('Allow', allowedArr.join(', '));
                    }
                } else if (allowedArr.length > 0) {
                    if (ctx.method === 'OPTIONS') {
                        ctx.status = 200;
                        ctx.body = '';
                        ctx.set('Allow', allowedArr.join(', '));
                    } else if (!allowed[ctx.method]) {
                        if (options.throw) {
                            const notAllowedThrowable =
                                typeof options.methodNotAllowed === 'function'
                                    ? options.methodNotAllowed() // set whatever the user returns from their function
                                    : new HttpError.MethodNotAllowed();

                            throw notAllowedThrowable;
                        } else {
                            ctx.status = 405;
                            ctx.set('Allow', allowedArr.join(', '));
                        }
                    }
                }
            }
        });
    };
};
Router.prototype.all = function (name, path, middleware) {
    if (typeof path === 'string') {
        middleware = Array.prototype.slice.call(arguments, 2);
    } else {
        middleware = Array.prototype.slice.call(arguments, 1);
        path = name;
        name = null;
    }
    // Sanity check to ensure we have a viable path candidate (eg: string|regex|non-empty array)
    if (
        typeof path !== 'string' &&
        !(path instanceof RegExp) &&
        (!Array.isArray(path) || path.length === 0)
    )
        throw new Error('You have to provide a path when adding an all handler');
    this.register(path, methods, middleware, { name });
    return this;
};
Router.prototype.redirect = function (source, destination, code) {
    // lookup source route by name
    if (typeof source === 'symbol' || source[0] !== '/') {
        source = this.url(source);
        if (source instanceof Error) throw source;
    }
    // lookup destination route by name
    if (
        typeof destination === 'symbol' ||
        (destination[0] !== '/' && !destination.includes('://'))
    ) {
        destination = this.url(destination);
        if (destination instanceof Error) throw destination;
    }
    return this.all(source, (ctx) => {
        ctx.redirect(destination);
        ctx.status = code || 301;
    });
};
Router.prototype.register = function (path, methods, middleware, opts = {}) {
    const router = this;
    const { stack } = this;
    // support array of paths
    if (Array.isArray(path)) {
        for (const curPath of path) {
            router.register.call(router, curPath, methods, middleware, opts);
        }

        return this;
    }
    // create route
    const route = new Layer(path, methods, middleware, {
        end: opts.end === false ? opts.end : true,
        name: opts.name,
        sensitive: opts.sensitive || this.opts.sensitive || false,
        strict: opts.strict || this.opts.strict || false,
        prefix: opts.prefix || this.opts.prefix || '',
        ignoreCaptures: opts.ignoreCaptures
    });

    if (this.opts.prefix) {
        route.setPrefix(this.opts.prefix);
    }

    // add parameter middleware
    for (let i = 0; i < Object.keys(this.params).length; i++) {
        const param = Object.keys(this.params)[i];
        route.param(param, this.params[param]);
    }

    stack.push(route);

    debug('defined route %s %s', route.methods, route.path);

    return route;
};
Router.prototype.route = function (name) {
    const routes = this.stack;

    for (let len = routes.length, i = 0; i < len; i++) {
        if (routes[i].name && routes[i].name === name) return routes[i];
    }

    return false;
};

Router.prototype.url = function (name, params) {
    const route = this.route(name);

    if (route) {
        const args = Array.prototype.slice.call(arguments, 1);
        return route.url.apply(route, args);
    }

    return new Error(`No route found for name: ${String(name)}`);
};

Router.prototype.match = function (path, method) {
    const layers = this.stack;
    let layer;
    const matched = {
        path: [],
        pathAndMethod: [],
        route: false
    };

    for (let len = layers.length, i = 0; i < len; i++) {
        layer = layers[i];

        debug('test %s %s', layer.path, layer.regexp);
        // eslint-disable-next-line unicorn/prefer-regexp-test
        if (layer.match(path)) {
            matched.path.push(layer);

            if (layer.methods.length === 0 || ~layer.methods.indexOf(method)) {
                matched.pathAndMethod.push(layer);
                if (layer.methods.length > 0) matched.route = true;
            }
        }
    }

    return matched;
};
Router.prototype.matchHost = function (input) {
    const { host } = this;
    return true
    if (!host) {
        return true;
    }

    if (!input) {
        return false;
    }

    if (typeof host === 'string') {
        return input === host;
    }

    if (typeof host === 'object' && host instanceof RegExp) {
        return host.test(input);
    }
};
Router.prototype.param = function (param, middleware) {
    this.params[param] = middleware;
    for (let i = 0; i < this.stack.length; i++) {
        const route = this.stack[i];
        route.param(param, middleware);
    }
    return this;
};
Router.url = function (path) {
    const args = Array.prototype.slice.call(arguments, 1);
    return Layer.prototype.url.apply({ path }, args);
};
