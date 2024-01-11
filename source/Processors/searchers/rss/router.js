import { sac } from "../runtime.js";
import RSSRoute from './rssLoader/routeMapV1.js'
import { buildFeedXML } from "./content/xml.js";
import { getFeedJson } from "./getFeedJson.js";
import { handleFeedQueryVector } from "./rssCache.js";
const rssPackagesAsync = async () => { return await sac.statusMonitor.get('packages', 'sac-rss-adapter').$value }
export let enabled = {}
let configs = {}

sac.eventBus.on('statusChange',async(e)=>{
    if(e.detail.name==='packages.sac-rss-adapter'){
        const rssPackages = await rssPackagesAsync()
        
        const packages = await rssPackages.local.list()
        packages.forEach(
            packageName=>{
                console.log(`正在加载${packageName}`)
                getRssPackageConfigs(packageName)
            }
        )
    }
})
async function getRssPackageConfigs(packageName){
    const rssPackages = await rssPackagesAsync()
    if (!enabled[packageName]) {
        let config = await rssPackages.local.getMeta(packageName)
        configs[packageName] = config
        let routers = config.routers
        //这一步才会启用路由
        routers.forEach(async router => {
            RSSRoute.get(router.endpoint, await rssPackages.local.load(packageName, router.file))
        });
        enabled[packageName] = configs
    }
    return configs[packageName]
}

export const rssrouter = new sac.路由管理器.Router()
rssrouter.post('/list', async (ctx, next) => {
    ctx.path = '/packages/sac-rss-adapter/list'
    next()
})
rssrouter.get('/list', async (ctx, next) => {
    ctx.path = '/packages/sac-rss-adapter/list'
    next()
})
rssrouter.post('/listAdapters/all', async (ctx, next) => {
    ctx.path = '/packages/sac-rss-adapter/listRemote'
    next()
})
rssrouter.post('/meta', async (ctx, next) => {
    ctx.path = '/packages/sac-rss-adapter/meta'
    next()
})
rssrouter.get('/meta', async (ctx, next) => {
    const rssPackages = await rssPackagesAsync()
    let { packageName } = ctx.query; // 获取页码和每页的数量，如果没有则默认为1和10
    ctx.body = await rssPackages.local.getMeta(packageName)
    return ctx;
})
rssrouter.post('/install', async (ctx, next) => {
    ctx.path = '/packages/sac-rss-adapter/install'
    next()
})
rssrouter.post('/unInstall', async (ctx, next) => {
    ctx.path = '/packages/sac-rss-adapter/uninstall'
    next()
})
rssrouter.post('/checkInstall', async (ctx, next) => {
    ctx.path = '/packages/sac-rss-adapter/checkInstall'
    next()
})
rssrouter.post('/getConfig', async (ctx, next) => {
    let name = ctx.req.body.packageName
    let config =await getRssPackageConfigs(name)
    ctx.body = config
    next()
})
rssrouter.post('/addFeed', async (ctx, next) => {
    const feedDefine = ctx.req.body
    const rssPackages = await rssPackagesAsync()
    let config = await rssPackages.local.getMeta(feedDefine.packageName)
    config.feeds.push(feedDefine)
    config = await rssPackages.local.setConfig(feedDefine.packageName, config)
    ctx.body = config
})
rssrouter.post('/feed', handleFeedRequest);
rssrouter.post('/feedContent',handleFeedContentRequest);
rssrouter.get('/feed/:path*', handleFeedRequest);
rssrouter.post('/vector',handleFeedQueryVector)
async function handleFeedRequest(ctx, next) {
    let format = 'json';
    let remote;
    let path;
    if (ctx.request.method === 'POST') {
        ({ path, format = 'json', remote } = ctx.req.body); // 对于POST请求，从请求体中获取参数
    } else {
        ({ format = 'json', remote } = ctx.query); // 对于GET请求，从查询参数中获取参数
        path = `/${ctx.params.path}`; // 对于GET请求，从路径参数中获取路径
    }
    let feedJson
    try {
        feedJson = await getFeedJson(path, remote);
    } catch (e) {
        feedJson = {
            title: '出错了',
            description: `无法为${path}生成rss,${e.message}`,
            item:[]
        }
    }
    console.log(feedJson)
    if (format === 'xml') {
        // 使用xmlbuilder创建XML
        let xml = buildFeedXML(feedJson, path);
        ctx.type = 'text/xml'
        ctx.body = xml
    } else if (format === 'html') {
        // 处理HTML格式
        let html = buildFeedHTML(feedJson, path);
        ctx.type = 'text/html'
        ctx.body = html
    } else {
        // 返回JSON
        ctx.type = 'application/json'
        ctx.body = feedJson
    }
    next()
}
async function handleFeedContentRequest(ctx, next) {
    let path = ctx.req.body.path
    let itemIndex = ctx.req.body.item;
    let feedJson = await getFeedJson(path, false); // 获取RSS feed
    let item = feedJson.item[itemIndex]; // 获取指定序号的item
    if (item) {
        // 如果item存在，返回它的内容
        ctx.type = 'application/json'
        ctx.body = item;
    } else {
        // 如果item不存在，返回一个错误消息
        ctx.status = 404;
        ctx.body = { error: 'Item not found' };
    }
    next()
}
function buildFeedHTML(feedJson, path) {
    // 这里是一个非常基础的示例，你可能需要根据你的需求来修改它
    let html = '<html><body>';
    html += `<h1>${feedJson.title}</h1>`;
    feedJson.item.forEach(item => {
        html += `<h2>${item.title}</h2>`;
        html += `<p>${item.description}</p>`;
    });
    html += '</body></html>';
    return html;
}
