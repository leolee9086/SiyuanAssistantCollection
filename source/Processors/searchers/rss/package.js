import { sac } from "../runtime.js";
import { lazyloadRouteHandler } from "./rssLoader/routeMapV1.js";
export const rssPackages=sac.包管理器.type(
    {
        name: 'rss',
        meta: 'maintainer.js',
        config:'rss.json',
        location: '@sac/installed/rss',
        load:async(packageName,fileName)=>{
            return  await lazyloadRouteHandler(rssPackages.resolve(packageName,fileName))
        }
    }
)
export const rssPackagesV2=sac.包管理器.type(
    {
        name: 'rss',
        meta: 'maintainer.js',
        config:'rss.json',
        location: '@sac/installed/rssV2',
        load:async(packageName,fileName)=>{
            return  await lazyloadRouteHandler(rssPackages.resolve(packageName,fileName))
        }
    }
)