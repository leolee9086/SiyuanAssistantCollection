import { sac } from "./runtime.js";
import { searchersRouter } from "./router.js";
sac.路由管理器.根路由.use('/search',searchersRouter.routes())