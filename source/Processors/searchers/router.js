import { sac } from "./runtime.js";
//这里要移动过来
import blockSearchRouter from "./blocks/blockSearchRouter.js";
import { rssrouter } from "./rss/router.js";
const { Router } = sac.路由管理器
let searchersRouter = new Router()
searchersRouter.use('/blocks', blockSearchRouter.routes())
searchersRouter.use('/rss',rssrouter.routes())

export { searchersRouter }
