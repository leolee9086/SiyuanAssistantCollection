import { Router } from "../runtime.js";
let tipsUIRouter = new Router()
tipsUIRouter.post('/show',(ctx)=>{
    if(ctx.body.item){
        console.log(ctx.body.item)
    }
})
export {
    tipsUIRouter as tipsUIRouter
}