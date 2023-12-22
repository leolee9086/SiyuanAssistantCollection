import { sac } from "../runtime.js";
import { rssPackages,rssPackagesV2 } from "./package.js";
import mocCtx from "./rssLoader/ctxPolyfills.js";
import RSSRoute from './rssLoader/routeMapV1.js'
import xmlBuilder from '../../../../static/xmlBuilder.js'
import { got } from "../runtime.js";
import XMLParser from '../../../../static/fast-xml-parser.js'

export const rssrouter = new sac.路由管理器.Router()
const listRss=async(page,pageSize)=>{
    page = Number(page);
    pageSize = Number(pageSize);
    let rssList = await rssPackages.list();
    let rssList1 = await rssPackagesV2.list();
    const allData = rssList.concat(rssList1); // 合并两个列表
    const total = allData.length; // 获取总数量
    const data = allData.slice((page - 1) * pageSize, page * pageSize); // 根据页码和每页的数量来获取数据
    return {data,total}
}
rssrouter.post('/list',async(ctx,next)=>{
    let { page = 1, pageSize = 10 } = ctx.req.body; // 获取页码和每页的数量，如果没有则默认为1和10
    let rssListData =await listRss(page,pageSize)
    ctx.body =  rssListData
})
rssrouter.get('/list',async(ctx,next)=>{
    let { page = 1, pageSize = 10 } = ctx.query; // 获取页码和每页的数量，如果没有则默认为1和10
    let rssListData =await listRss(page,pageSize)
    console.log(rssListData)
    ctx.body =  rssListData
})

rssrouter.post('/meta',async (ctx, next) => {
    let { name } = ctx.req.body; // 获取页码和每页的数量，如果没有则默认为1和10
    ctx.body = await rssPackages.getMeta(name)
    return ctx;
})

let enabled = {}
let configs ={}
rssrouter.post('/enable', async (ctx, next) => {
    let name =ctx.req.body.name
    if (!enabled[name]) {
        let config = await rssPackages.getConfig(name)
        configs[name]=config
        let routers = config.routers
        routers.forEach(async router => {
            RSSRoute.get(router.endpoint, await rssPackages.load(name, router.file))
        });
        enabled[name] = true
    }
    let links =''
    configs[name].feeds.forEach(
       feed=> links+=`<div><span data-sac-href='/search/rss/feed${feed.path}'>${feed.description||feed.path}</span></div>`
    )
    ctx.body =links
})
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
    let feedJson = await getFeedJson(path, remote);
    console.log(feedJson)
    if (format === 'xml') {
        // 使用xmlbuilder创建XML
        let xml = buildFeedXML(feedJson, path);
        ctx.type = 'text/xml'
        ctx.body = xml
    } else {
        // 返回JSON
        ctx.type = 'application/json'
        ctx.body = feedJson
    }
    next()
}
rssrouter.post('/feed', handleFeedRequest);
rssrouter.get('/feed/:path*', handleFeedRequest);
async function getFeedJson(path, remote) {
    let feedJson;
    if (remote) {
        // 从远程服务器获取RSS feed
        const response = await got(remote);
        if (response.headers['content-type'] === 'application/json') {
            feedJson = JSON.parse(response.body);
        } else if (response.headers['content-type'] === 'text/xml') {
            feedJson = XMLParser.parse(response.body);
        }
    } else {
        let _ctx = mocCtx(path, {})
        let data = await new Promise((resolve, reject) => {
            try {
                RSSRoute.routes('/')(_ctx, () => {
                    resolve(_ctx)
                });
            } catch (e) {
                reject(e)
            }
        })
        feedJson = data.state.data
    }
    return feedJson;
}
function buildFeedXML(feedJson, path) {
    let rss = xmlBuilder.create('rss', { version: '1.0', encoding: 'UTF-8' })
        .att('version', '2.0')
        .ele('channel')
            .ele('title', {}, feedJson.title)
            .up()
            .ele('link', {}, `${window.location.host}/search/rss/feed/${path}`)
            .up()
            .ele('description', {}, feedJson.description)
            .up();

    // 添加数据到feed
    feedJson.item.forEach(item => {
        rss.ele('item')
            .ele('title', {}, item.title)
            .up()
            .ele('link', {}, item.link)
            .up()
            .ele('description', {}, item.description)
            .up()
            .ele('pubDate', {}, item.pubDate)
            .up();
    });

    return rss.end({ pretty: true });
}
