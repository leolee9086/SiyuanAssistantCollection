import { sac } from "../../asyncModules.js";
const 包路由 = new sac.路由管理器.Router()
包路由.post('/listPackageTypes', async (ctx, next) => {
    console.log(ctx)
    ctx.body = {}
    ctx.body.data = await sac.包管理器.listPackageDefines()
    ctx.body.msg = 0
})
包路由.get('/listPackageTypes', async (ctx, next) => {
    console.log(ctx)
    ctx.body = {}
    ctx.body.data = await sac.包管理器.listPackageDefines()
    ctx.body.msg = 0
})
包路由.get('/:packageTypeTopic/list', async (ctx, next) => {
    let topic = ctx.params.packageTypeTopic
    let packageHandeler = sac.statusMonitor.get('packages', topic).$value
    let { page = 1, pageSize = 10 } = ctx.query; // 获取页码和每页的数量，如果没有则默认为1和10
    let rssListData = await packageHandeler.list(page, pageSize)
    ctx.body = {
        data: rssListData,
        total: rssListData.length
    }
})
包路由.post('/:packageTypeTopic/list', async (ctx, next) => {
    let topic = ctx.params.packageTypeTopic
    let packageHandeler = sac.statusMonitor.get('packages', topic).$value
    let { page = 1, pageSize = 10 } = ctx.req.body; // 获取页码和每页的数量，如果没有则默认为1和10
    let rssListData = await packageHandeler.list(page, pageSize)
    ctx.body = {
        data: rssListData,
        total: rssListData.length
    }
})
包路由.post('/:packageTypeTopic/listRemote', async (ctx, next) => {
    let topic = ctx.params.packageTypeTopic
    let packageHandeler = sac.statusMonitor.get('packages', topic).$value
    let PackagesList=await packageHandeler.listFromAllRemoteSource()
    ctx.body= PackagesList
})
包路由.post('/:packageTypeTopic/meta',async(ctx,next)=>{
    let topic = ctx.params.packageTypeTopic
    let {name}=ctx.req.body
    let packageHandeler = sac.statusMonitor.get('packages', topic).$value
    ctx.body = await packageHandeler.getMeta(name)
})
包路由.post('/:packageTypeTopic/install',async(ctx,next)=>{
    let topic = ctx.params.packageTypeTopic
    let packageInfo=ctx.req.body
    let packageHandeler = sac.statusMonitor.get('packages', topic).$value
    ctx.body = await packageHandeler.install(packageInfo)
})
包路由.post('/:packageTypeTopic/uninstall',async(ctx,next)=>{
    let topic = ctx.params.packageTypeTopic
    let packageInfo=ctx.req.body
    let packageHandeler = sac.statusMonitor.get('packages', topic).$value
    ctx.body = await packageHandeler.install(packageInfo)
})
export { 包路由 as router }