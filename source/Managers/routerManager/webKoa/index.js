import { EventEmitter } from "../../../../static/node_events.js"
import {HttpError } from "../../../../static/http-errors.js"
import { Stream } from "../../../../static/stream.js";
import only from "../../../../static/only.js";
import onFinished  from '../../../../static/on-finished.js'
import statuses from '../../../../static/statuses.js'
//这个跟koa-compose是一个东西
import { compose } from "../routerUtils.js";
import { context } from "./context.js";
import request  from './request.js'
import response from "./response.js";
import http from './http.js'
export {HttpError}

export default class Application extends EventEmitter {
    constructor(options = {}) {
        super(import.meta)
        this.proxy = options.proxy || false
        this.subdomainOffset = options.subdomainOffset || 2;
        this.proxyIpHeader = options.proxyIpHeader || 'X-Forwarded-For';
        this.maxIpsCount = options.maxIpsCount || 0;
        this.env = options.env || process.env.NODE_ENV || 'development';
        this.compose = options.compose || compose

        if (options.keys) this.keys = options.keys;
        this.middleware = [];

        //这里需要一个兼容浏览器与node的context对象
        this.context = Object.create(context);
        //这里需要一个兼容浏览器与node的request对象
        this.request = Object.create(request);
        //这里需要一个兼容浏览器与node的response对象
        this.response = Object.create(response);
        //使用注入的logger模块
        this.logger=options.logger
        //这里在koa中主要是用于兼容util.inspect方法
        if (globalThis.util&&util.inspect.custom) {
            this[util.inspect.custom] = this.inspect;
        }
        if (options.asyncLocalStorage) {
            //当require可用的时候使用nodejs的async_hooks
            if (globalThis.reuqire) {
                const { AsyncLocalStorage } = require('async_hooks');
                assert(AsyncLocalStorage, 'Requires node 12.17.0 or higher to enable asyncLocalStorage');
                this.ctxStorage = new AsyncLocalStorage();
            }
        }
    }
    listen(...args) {
        //类似的,这里在浏览器端也是不可用的
        if (window.require) {
            this.logger?this.logger.koaDebug('listen'):null
            const server = http.createServer(this.callback())
            return server.listen(...args)
        }
    }

    toJSON() {
        return only(this, [
            'subdomainOffset',
            'proxy',
            'env'
        ])
    }
    inspect() {
        return this.toJSON()
    }
    //koa的use,只能接受函数
    use(fn) {
        if (typeof fn !== 'function') throw new TypeError('middleware must be a function!')
        this.logger?this.logger.koaDebug('use %s', fn._name || fn.name || '-'):null
        this.middleware.push(fn)
        return this
    }
    //这个就是实际处理请求的函数
    callback() {
        const fn = this.compose(this.middleware)
        if (!this.listenerCount('error')) this.on('error', this.onerror)
        const handleRequest = (req, res) => {
            const ctx = this.createContext(req, res)
            if (!this.ctxStorage) {
                return this.handleRequest(ctx, fn)
            }
            return this.ctxStorage.run(ctx, async () => {
                return await this.handleRequest(ctx, fn)
            })
        }
        return handleRequest
    }
    //这里能够在异步处理中获取当前上下文
    get currentContext() {
        if (this.ctxStorage) return this.ctxStorage.getStore()
    }

    handleRequest(ctx, fnMiddleware) {
        const res = ctx.res
        res.statusCode = 404
        const onerror = err => ctx.onerror(err)
        const handleResponse = () => respond(ctx)
        onFinished(res, onerror)
        return fnMiddleware(ctx).then(handleResponse).catch(onerror)
    }
    //创建请求,这里在内部请求(函数路由模式时有不同的处理)
    createContext(req, res) {
        const context = Object.create(this.context)
        const request = context.request = Object.create(this.request)
        const response = context.response = Object.create(this.response)
        context.app = request.app = response.app = this
        context.req = request.req = response.req = req
        context.res = request.res = response.res = res
        request.ctx = response.ctx = context
        request.response = response
        response.request = request
        context.originalUrl = request.originalUrl = req.url
        context.state = {}
        return context
    }
    onerror(err) {
        // When dealing with cross-globals a normal `instanceof` check doesn't work properly.
        // See https://github.com/koajs/koa/issues/1466
        // We can probably remove it once jest fixes https://github.com/facebook/jest/issues/2549.
        const isNativeError =
            Object.prototype.toString.call(err) === '[object Error]' ||
            err instanceof Error
        if (!isNativeError) throw new TypeError(util.format('non-error thrown: %j', err))

        if (err.status === 404 || err.expose) return
        if (this.silent) return

        const msg = err.stack || err.toString()
        console.error(`\n${msg.replace(/^/gm, '  ')}\n`)
    }

    static get default() {
        return Application
    }
    //这里仍然是node限定
    createAsyncCtxStorageMiddleware() {
        const app = this
        return async function asyncCtxStorage(ctx, next) {
            await app.ctxStorage.run(ctx, async () => {
                return await next()
            })
        }
    }

}
function respond(ctx) {
    // allow bypassing koa
    if (ctx.respond === false) return
    if (!ctx.writable) return
    const res = ctx.res
    let body = ctx.body
    const code = ctx.status
    // ignore body
    if (statuses.empty[code]) {
        // strip headers
        ctx.body = null
        return res.end()
    }
    if (ctx.method === 'HEAD') {
        if (!res.headersSent && !ctx.response.has('Content-Length')) {
            const { length } = ctx.response
            if (Number.isInteger(length)) ctx.length = length
        }
        return res.end()
    }
    // status body
    if (body == null) {
        if (ctx.response._explicitNullBody) {
            ctx.response.remove('Content-Type')
            ctx.response.remove('Transfer-Encoding')
            ctx.length = 0
            return res.end()
        }
        if (ctx.req.httpVersionMajor >= 2) {
            body = String(code)
        } else {
            body = ctx.message || String(code)
        }
        if (!res.headersSent) {
            ctx.type = 'text'
            ctx.length = Buffer.byteLength(body)
        }
        return res.end(body)
    }
    // responses
    if (Buffer.isBuffer(body)) return res.end(body)
    if (typeof body === 'string') return res.end(body)
    if (body instanceof Stream) return body.pipe(res)
    // body: json
    body = JSON.stringify(body)
    if (!res.headersSent) {
        ctx.length = Buffer.byteLength(body)
    }
    res.end(body)
}
