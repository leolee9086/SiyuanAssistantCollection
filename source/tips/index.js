import { sac } from "../asyncModules.js";
import { DOM键盘事件表 } from "../Managers/eventsManager/DOMKeyBoardEvent.js";
import { tipsUIRouter } from "./UI/router.js";
console.log(sac.路由管理器.根路由)
sac.eventBus.on(DOM键盘事件表.键盘按下,(e)=>{
    console.log(sac.路由管理器.internalFetch('search',{data:'aaa'}))
})
let tipsRouter = new sac.路由管理器.Router()
tipsRouter.use('/UI',tipsUIRouter.routes())
sac.路由管理器.根路由.use('/tips',tipsRouter.routes())
let data =await sac.路由管理器.internalFetch('/tips/UI/show',{
    body:{
        item:{
            title:'测试'
        }
    },
    method:"POST"
})
console.log(data)