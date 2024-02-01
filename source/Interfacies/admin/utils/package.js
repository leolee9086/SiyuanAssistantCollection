import { sac } from "../../../asyncModules.js"
let { 路由管理器 } = sac
let { internalFetch } = 路由管理器
export const install = async (packageInfo) => {
    let { topic } = packageInfo
    let res = await internalFetch(`/packages/${topic}/install`, {
        body: packageInfo, method: 'POST'
    })
    return res
}
export const enable = async (topic) => {
    let res = {}
    try {
        res = await internalFetch(`/packages/enable`, {
            body: { topic: topic }, method: 'POST'
        })
    } catch (e) {
        console.error(e)
    }
    return res
}

export const 判定尚未安装 = (repo,已安装包列表) => {
    console.log(repo)
    sac.路由管理器.internalFetch(`/packages/${repo.topic}/checkInstall`, {
        body: repo.package, method: 'POST'
    }).then(res => {
        已安装包列表[repo.name] = res.body
    })
}
