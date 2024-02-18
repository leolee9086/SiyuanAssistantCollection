import { sac } from '../../../asyncModules.js'
import { deleteTokenContents, highlightToken } from '../../../utils/DOMTokenizer.js'
import { kernelWorker } from '../../../utils/webworker/kernelWorker.js'
let { Router, buildInternalFetch } = sac.路由管理器
export let actionsRouter = new Router()
actionsRouter.post('/kernel/:path', (ctx, next) => {
    let body = ctx.req.body
    let path = ctx.params.path
    kernelWorker[path](body)
    next()
})
actionsRouter.post('/ui/openblock', (ctx, next) => {
    let body = ctx.req.body
    if (window.require) {
        window.open(`siyuan://blocks/${body.id}`)
    }
    next()
})
actionsRouter.post('/ui/highLightToken', (ctx, next) => {
    let body = ctx.req.body
    highlightToken(body.token)
    next()
})
actionsRouter.post('/ui/deleteToken', (ctx, next) => {
    let body = ctx.req.body
    deleteTokenContents(body.token)
    next()
})
export let actionFetch = buildInternalFetch(actionsRouter)
export let postAction = (path, body) => {
    console.log(path, body)
    actionFetch(
        path, {
        method: "POST",
        body: body
    }
    )
}