import {sac} from '../../../asyncModules.js'
import { kernelWorker } from '../../../utils/webworker/kernelWorker.js'
let {Router,buildInternalFetch} =  sac.路由管理器
export let actionsRouter =  new Router()
actionsRouter.post('/kernel/:path',(ctx,next)=>{
    console.log(ctx)
    let body =ctx.req.body
    let path =ctx.params.path
    kernelWorker[path](body)
    next()
})
export let actionFetch=buildInternalFetch(actionsRouter)
export let postAction=(path,body)=>actionFetch(
    path,{
        method:"POST",
        body:body
    }
)