import { sac } from "./runtime.js";
import { tipsUIRouter } from "./UI/router.js";
let tipsRouter = new sac.路由管理器.Router()
tipsRouter.use('/UI',tipsUIRouter.routes())
sac.路由管理器.根路由.use('/tips',tipsRouter.routes())
