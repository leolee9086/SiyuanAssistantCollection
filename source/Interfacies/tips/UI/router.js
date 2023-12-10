import { Router } from "../runtime.js";
import {showTips} from './render.js'
let tipsUIRouter = new Router()
tipsUIRouter.post('/show',(ctx)=>{
    if(ctx.req.body.item&&ctx.req.body.item instanceof Array){
        showTips(ctx.req.body)
    }
})
export {
    tipsUIRouter as tipsUIRouter
}