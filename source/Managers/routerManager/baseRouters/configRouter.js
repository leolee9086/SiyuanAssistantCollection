import Router from "../router.js";
import { sac } from "../../../asyncModules.js";
let configRouter = new Router()
configRouter.post('/query',(ctx,next)=>{
    ctx.body.data=sac.configurer.get(...ctx.req.body.query).$value
})
configRouter.post('/set',(ctx,next)=>{
    ctx.body.data=sac.configurer.set(...ctx.req.body.query,ctx.req.body.value).$value
})
export default configRouter