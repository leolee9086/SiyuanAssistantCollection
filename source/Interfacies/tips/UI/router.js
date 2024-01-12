import { Router } from "../runtime.js";
import {处理并显示tips} from './render.js'
let tipsUIRouter = new Router()
tipsUIRouter.post('/UI/show',(ctx)=>{
    if(ctx.req.body.item&&ctx.req.body.item instanceof Array){
        处理并显示tips(ctx.req.body)
    }
})
export {
    tipsUIRouter as tipsUIRouter
}