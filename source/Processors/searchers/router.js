import { sac } from "./runtime.js";
import { loadRSS } from "../../searchers/websearchers/rssLoader/routeMapV1.js";
import RSSRoute from "../../searchers/websearchers/rssLoader/routeMapV1.js";
import blockSearchRouter from "./blocks/blockSearchRouter.js";
const { Router } = sac.路由管理器
let searchersRouter = new Router()
searchersRouter.use('/blocks', blockSearchRouter.routes())
searchersRouter.post('/rss/list', async (ctx, next) => {
    let rssList = await sac.包管理器.type({
        name: 'rss',
        meta: 'maintainer.js',
        location: '@sac/installed/rss'
    }).list()
    let rssList1 = await sac.包管理器.type({
        name: 'rss',
        meta: 'maintainer.js',
        location: '@sac/installed/rssV2'
    }).list()
    ctx.body = rssList.concat(rssList1)
    return ctx
})
searchersRouter.get('/rss/list', async (ctx, next) => {
    let rssList = await sac.包管理器.type({
        name: 'rss',
        meta: 'maintainer.js',
        location: '@sac/installed/rss'
    }).list()
    let rssList1 = await sac.包管理器.type({
        name: 'rss',
        meta: 'maintainer.js',
        location: '@sac/installed/rssV2'
    }).list()
    ctx.body = rssList.concat(rssList1)
    return ctx
})
searchersRouter.post('/rss/router', async (ctx, next) => {
    let files= await sac.包管理器.type({
        name: 'rss',
        meta: 'maintainer.js',
        location: '@sac/installed/rss'
    }).file(ctx.req.body.name)
    files= files.filter(item=>{return !item.isDir&&item.name.endsWith('.js')})
    let List=[]
    for(let file of files){
        let realPath=sac.selfPath+`/installed/rss/${ctx.req.body.name}/`+file.name
        let fakePath=`./routes/${ctx.req.body.name}/`+file.name
        let layers=RSSRoute.stack.filter(
            item=> {
               return (item.stack[0].$routeHandlerPath===realPath)||(item.stack[0].$routeHandlerPath+'.js'===fakePath)
            }
        )
        for(let layer of layers){
            List.push({
                name:ctx.req.body.name,
                subRoute:layer.path,
                paramNames:layer.paramNames
            })
        }
    }
    ctx.body=List
})
searchersRouter.use(
    '/rss/feed',RSSRoute.routes('/')
)
export { searchersRouter }
