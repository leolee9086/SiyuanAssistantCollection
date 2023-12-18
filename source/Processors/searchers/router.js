import { sac } from "./runtime.js";
//这里要移动过来
import mocCtx from "./rss/rssLoader/ctxPolyfills.js";
import RSSRoute, { lazyloadRouteHandler } from "./rss/rssLoader/routeMapV1.js";
import blockSearchRouter from "./blocks/blockSearchRouter.js";
import { rssPackages, rssPackagesV2 } from "./rss/package.js";
const { Router } = sac.路由管理器
let searchersRouter = new Router()
searchersRouter.use('/blocks', blockSearchRouter.routes())
searchersRouter.post('/rss/list', async (ctx, next) => {
    let { page = 1, pageSize = 10 } = ctx.req.body; // 获取页码和每页的数量，如果没有则默认为1和10
    page = Number(page);
    pageSize = Number(pageSize);
    let rssList = await rssPackages.list();
    let rssList1 = await rssPackagesV2.list();
    const allData = rssList.concat(rssList1); // 合并两个列表
    const total = allData.length; // 获取总数量
    const data = allData.slice((page - 1) * pageSize, page * pageSize); // 根据页码和每页的数量来获取数据
    ctx.body = {
        total,
        data,
    };
    return ctx;
})
searchersRouter.post('/rss/meta', async (ctx, next) => {
    let { name } = ctx.req.body; // 获取页码和每页的数量，如果没有则默认为1和10
    console.log(name)
    ctx.body = await rssPackages.getMeta(name)
    return ctx;
})
searchersRouter.get('/rss/list', async (ctx, next) => {
    let { page = 1, pageSize = 10 } = ctx.query; // 获取页码和每页的数量，如果没有则默认为1和10
    page = Number(page);
    pageSize = Number(pageSize);
    let rssList = await rssPackages.list();
    let rssList1 = await rssPackagesV2.list();
    const allData = rssList.concat(rssList1); // 合并两个列表
    const total = allData.length; // 获取总数量
    const data = allData.slice((page - 1) * pageSize, page * pageSize); // 根据页码和每页的数量来获取数据
    ctx.body = {
        total,
        data,
    };
    return ctx;
});

let enabled = {}
let configs ={}
searchersRouter.post('/rss/enable', async (ctx, next) => {
    if (!enabled[ctx.req.body.name]) {
        let config = await rssPackages.getConfig(ctx.req.body.name)
        configs[ctx.req.body.name]=config
        let routers = config.routers
        routers.forEach(async router => {
            RSSRoute.get(router.endpoint, await rssPackages.load(ctx.req.body.name, router.file))
        });
        enabled[ctx.req.body.name] = true
    }
    let links =''
    configs[ctx.req.body.name].feeds.forEach(
       feed=> links+=`<div><span data-sac-href='/search/rss/feed${feed.path}'>${feed.description||feed.path}</span></div>`
    )
    ctx.body =links
})
searchersRouter.get('/rss/enable', async (ctx, next) => {
    let config = await rssPackages.getConfig(ctx.query.name)
    let routers = config.routers
    routers.forEach(async router => {
        RSSRoute.get(router.endpoint, await rssPackages.load(ctx.query.name, router.file))
    });
    ctx.body = `<div><span href='search/rss/feed${config.feeds[0].path}'>http://127.0.0.1/search/rss/feed${config.feeds[0].path}</a></div>`
})
searchersRouter.get(
    '/rss/feed/(.*)', async (ctx, next) => {
        console.log(ctx)
        let path = `/${ctx.params[0]}`; // 修改ctx.path以匹配RSSRoute中的路由
        let _ctx = mocCtx(path, {})
        let data = await new Promise((resolve, reject) => {
            try {
                RSSRoute.routes('/')(_ctx, () => {
                    resolve(
                        _ctx)
                });
            } catch (e) {
                reject(e)
            }
        })
        let feedJson = data.state.data
        console.log(feedJson, data)
        let xml = `<?xml version="1.0" encoding="UTF-8" ?>
        <rss  version="2.0">
        <channel>
            <title>${feedJson.title}</title>
            <link>${window.location.host}/search/rss/feed/${path}</link>
            <description>${feedJson.description}</description>`;

        // 添加数据到feed
        feedJson.item.forEach(item => {
            xml += `
            <item>
                <title>${item.title}</title>
                <link>${item.link}</link>
                <description>${item.description}</description>
                <pubDate>${item.pubDate}</pubDate>
            </item>`;
        });
        xml += `
        </channel>
        </rss>`;
        ctx.type = 'text/xml'
        ctx.body = xml
        next()
    }
)
export { searchersRouter }
