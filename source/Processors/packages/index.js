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
包路由.post('/enable', async (ctx, next) => {
    console.log(ctx)
    const { topic } = ctx.req.body
    if (topic) {
        let packageHandeler = sac.statusMonitor.get('packages', topic).$value
        if (packageHandeler) {
            packageHandeler.enabled = true
            ctx.body = {
                msg: 0,
                data: { enabled: packageHandeler.enabled }
            }
        } else {
            ctx.body = {
                msg: 1,
                error: "没有找到包定义"

            }
        }
    } else {
        ctx.body = {
            msg: 1,
            error: "topic不能为空"
        }
    }
    return ctx
})
包路由.post('/checkPackageEnabled', async (ctx, next) => {
    console.log(ctx)
    const { topic } = ctx.req.body
    if (topic) {
        let packageHandeler = sac.statusMonitor.get('packages', topic).$value
        if (packageHandeler) {
            ctx.body = {
                data: { enabled: packageHandeler.enabled },
                msg: 0
            }
        }else{
            ctx.body = {
                error: '没有找到包定义',
                mas: 1
            }
    
        }
    } else {
        ctx.body = {
            error: 'topic不能为空',
            mas: 1
        }
    }
})
包路由.get('/:packageTypeTopic/list', async (ctx, next) => {
    let topic = ctx.params.packageTypeTopic
    let packageHandeler = sac.statusMonitor.get('packages', topic).$value
    let { page = 1, pageSize = 10 } = ctx.query; // 获取页码和每页的数量，如果没有则默认为1和10
    let rssListData = await packageHandeler.local.list(page, pageSize)
    ctx.body = {
        data: rssListData,
        total: rssListData.length
    }
})
包路由.post('/:packageTypeTopic/list', async (ctx, next) => {
    let topic = ctx.params.packageTypeTopic
    let packageHandeler = sac.statusMonitor.get('packages', topic).$value
    let { page = 1, pageSize = 10 } = ctx.req.body; // 获取页码和每页的数量，如果没有则默认为1和10
    let rssListData = await packageHandeler.local.list(page, pageSize)
    ctx.body = {
        data: rssListData,
        total: rssListData.length
    }
})
包路由.post('/:packageTypeTopic/listRemote', async (ctx, next) => {
    let topic = ctx.params.packageTypeTopic
    let packageHandeler = sac.statusMonitor.get('packages', topic).$value
    if (packageHandeler) {
        let PackagesList = await packageHandeler.remote.listFromAllRemoteSource()
        ctx.body = PackagesList
    } else {
        ctx.body = []
    }
})
包路由.post('/:packageTypeTopic/meta', async (ctx, next) => {
    let topic = ctx.params.packageTypeTopic
    let { packageName } = ctx.req.body
    let packageHandeler = sac.statusMonitor.get('packages', topic).$value
    ctx.body = await packageHandeler.local.getMeta(packageName)
})
包路由.post('/:packageTypeTopic/install', async (ctx, next) => {
    let topic = ctx.params.packageTypeTopic
    let packageInfo = ctx.req.body
    let packageHandeler = sac.statusMonitor.get('packages', topic).$value
    if (packageHandeler) {
        ctx.body = await packageHandeler.installer.install(packageInfo)
    } else {
        ctx.body = { msg: 1, error: '未能找到包定义' }
        throw '未能找到包类型' + topic + "的定义"
    }
})
包路由.post('/:packageTypeTopic/uninstall', async (ctx, next) => {
    let topic = ctx.params.packageTypeTopic
    let packageInfo = ctx.req.body
    let packageHandeler = sac.statusMonitor.get('packages', topic).$value
    ctx.body = await packageHandeler.installer.uninstall(packageInfo)
})
包路由.post('/:packageTypeTopic/checkInstall', async (ctx, next) => {
    let topic = ctx.params.packageTypeTopic
    let packageInfo = ctx.req.body
    let packageHandeler = sac.statusMonitor.get('packages', topic).$value
    ctx.body = await packageHandeler.installer.checkInstall(packageInfo)
})

export { 包路由 as router }