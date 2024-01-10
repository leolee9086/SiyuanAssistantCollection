import mocCtx from "./rssLoader/ctxPolyfills.js";
import RSSRoute from './rssLoader/routeMapV1.js';
import { got } from "../runtime.js";
import XMLParser from '../../../../static/fast-xml-parser.js';
import fs from "../../../polyfills/fs.js";
import path from "../../../polyfills/path.js";
import crypto from "../../../../static/crypto-browserify.js";
import { readFromCache, writeToCache } from "./rssCache.js";
function getCachePath(filePath, query) {
    const hash = crypto.createHash('md5').update(filePath + JSON.stringify(query)).digest('hex');
    return path.join('/temp/noobTemp/rss', hash);
}
async function fetchFromRemoteRss(remote) {
    const response = await got(remote);
    if (response.headers['content-type'] === 'application/json') {
        return JSON.parse(response.body);
    } else if (response.headers['content-type'] === 'text/xml') {
        return XMLParser.parse(response.body);
    }
}

async function fetchFromLocal(filePath) {
    let _ctx = mocCtx(filePath, {});
    let data = await new Promise((resolve, reject) => {
        try {
            RSSRoute.routes('/')(_ctx, () => {
                resolve(_ctx);
            });
        } catch (e) {
            reject(e);
        }
    });
    return data.state.data;
}
export async function getFeedJson(filePath, remote, query) {
    await fs.mkdir('/temp/noobTemp/rss');
    const cachePath = getCachePath(filePath, query);
    //检查缓存文件是否存在
    let feedJson = await readFromCache(cachePath, remote);
    if (!feedJson) {
        if (remote) {
            feedJson = await fetchFromRemoteRss(remote)
        }
        else {
            feedJson= await fetchFromLocal(filePath);
        }
    }
    // 将数据写入到缓存文件中
    await writeToCache(cachePath, feedJson);
    console.error(feedJson)
    return feedJson;
}