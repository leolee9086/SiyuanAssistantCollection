import { sac } from "../runtime.js";
import { lazyloadRouteHandler } from "./rssLoader/routeMapV1.js";
export const rssPackages=sac.包管理器.type(
    {
        name: 'rss',
        meta: 'rss.json',
        config:'rss.json',
        location: '@sac/installed/rss',
        topic:"sac-rss-adapter",
        load:async(packageName,fileName)=>{
            return  await lazyloadRouteHandler(rssPackages.resolve(packageName,fileName))
        }
    }
)
export const rssPackagesV2=sac.包管理器.type(
    {
        name: 'rss',
        meta: 'rss.json',
        config:'rss.json',
        location: '@sac/installed/rssV2',
        topic:"sac-rss-adapter",
        load:async(packageName,fileName)=>{
            return  await lazyloadRouteHandler(rssPackages.resolve(packageName,fileName))
        }
    }
)