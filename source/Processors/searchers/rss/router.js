import { sac } from "../runtime.js";
import mocCtx from "./rssLoader/ctxPolyfills.js";
import RSSRoute from './rssLoader/routeMapV1.js'
import xmlBuilder from '../../../../static/xmlBuilder.js'
import { got } from "../runtime.js";
import XMLParser from '../../../../static/fast-xml-parser.js'
import fs from "../../../polyfills/fs.js";
import path from "../../../polyfills/path.js"
import crypto from "../../../../static/crypto-browserify.js"
const rssPackagesAsync =async()=>{return await sac.statusMonitor.get('packages','sac-rss-adapter').$value}

export const rssrouter = new sac.路由管理器.Router()
const listRss=async(page,pageSize)=>{
    const rssPackages=await rssPackagesAsync()
    page = Number(page);
    pageSize = Number(pageSize);
    let rssList = await rssPackages.list();
    const total = rssList.length; // 获取总数量
    const data = rssList.slice((page - 1) * pageSize, page * pageSize); // 根据页码和每页的数量来获取数据
    return {data,total}
}
rssrouter.post('/list',async(ctx,next)=>{
    ctx.path='/packages/sac-rss-adapter/list'
    next()
})
rssrouter.get('/list',async(ctx,next)=>{
    ctx.path='/packages/sac-rss-adapter/list'
    next()
})
rssrouter.post('/listAdapters/all',async(ctx,next)=>{
    ctx.path='/packages/sac-rss-adapter/listRemote'
    next()
})

rssrouter.post('/meta',async (ctx, next) => {
    ctx.path='/packages/sac-rss-adapter/meta'
    next()
})
rssrouter.get('/meta',async (ctx, next) => {
    const rssPackages=await rssPackagesAsync()
    let { name } = ctx.query; // 获取页码和每页的数量，如果没有则默认为1和10
    ctx.body = await rssPackages.getMeta(name)
    return ctx;
})
rssrouter.post('/install',async (ctx, next) => {
    ctx.path='/packages/sac-rss-adapter/install'
    next()
})
rssrouter.post('/unInstall',async (ctx, next) => {
    ctx.path='/packages/sac-rss-adapter/uninstall'
    next()
})
rssrouter.post('/checkInstall',async (ctx, next) => {
    ctx.path='/packages/sac-rss-adapter/checkInstall'
    next()
})
let enabled = {}
let configs ={}
rssrouter.post('/enable', async (ctx, next) => {
    const rssPackages=await rssPackagesAsync()

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
    ctx.body =configs[name]
    next()
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
rssrouter.post('/feed', handleFeedRequest);
rssrouter.post('/feedContent', handleFeedContentRequest);

rssrouter.get('/feed/:path*', handleFeedRequest);
rssrouter.get('/package/:name*', async(ctx,next)=>{
    const rssPackages=await rssPackagesAsync()

    let zipData = await rssPackages.packageZip(ctx.params.name);
    ctx.type = 'application/zip';
    ctx.set('Content-Disposition', `attachment; filename=${ctx.params.name}.zip`);
    ctx.body = zipData;
});
async function handleFeedContentRequest(ctx, next) {
    let path = ctx.req.body.path 
    let itemIndex = ctx.req.body.item; 
    console.log(path,itemIndex)
    let feedJson = await getFeedJson(path, false); // 获取RSS feed
    console.log(feedJson)
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
async function getFeedJson(filePath, remote, query) {
    let feedJson;
    await fs.mkdir('/temp/noobTemp/rss')
    const hash = crypto.createHash('md5').update(filePath + JSON.stringify(query)).digest('hex');
    const cachePath = path.join('/temp/noobTemp/rss', hash);

    // 检查缓存文件是否存在
    if (await fs.exists(cachePath)) {
        // 从缓存文件中读取数据
        const data = await fs.readFile(cachePath);
        feedJson = JSON.parse(data);
    } else {
        if (remote) {
            // 从远程服务器获取RSS feed
            const response = await got(remote);
            if (response.headers['content-type'] === 'application/json') {
                feedJson = JSON.parse(response.body);
            } else if (response.headers['content-type'] === 'text/xml') {
                feedJson = XMLParser.parse(response.body);
            }
        } else {
            let _ctx = mocCtx(filePath, {})
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
        // 将数据写入到缓存文件中
        await fs.writeFile(cachePath, JSON.stringify(feedJson));
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
