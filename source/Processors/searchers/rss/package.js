import { lazyloadRouteHandler } from "./rssLoader/routeMapV1.js";
export const rssPackages=
    {
        //包类型的名称
        name: 'sac-rss-adapter',
        //包类型的元数据名称
        meta: 'rss.json',
        //包类型的设置文件名称,可以为空
        config:'rss.json',
        //包安装位置,必须
        location: '/data/public/sac-rss-adapters/installed',
        //检索用的关键词,必须
        topic:"sac-rss-adapter",
        //支持的下载源
        adapters:['github','npm','siyuan'],
        //支持单文件包,默认为空
        singleFile:false,
        //加载函数,可以为空(仅由sac管理下载),可以声明一个文件地址
        load:async(packageName,fileName)=>{
            return  await lazyloadRouteHandler(rssPackages.resolve(packageName,fileName))
        },   descriptions:{
            default:"思源小助手插件rss模块的rss解析适配器"
        }
    }

