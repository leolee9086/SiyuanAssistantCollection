import ctx from './ctxPolyfills.js';
import rssV1router from './routeMapV1.js'

export const parseRss = (path, options) => {
    let url
    try{
     url = new URL(path);
    }catch(e){
         url = new URL(location.origin+path)
    }
    const pathWithQuery = url.pathname + url.search;  // "/zhihu/zhuanlan/googledevelopers?query=example"
    let _ctx = ctx(pathWithQuery, options)
    return new Promise((resolve, reject) => {
        try {
            rssV1router.routes('/')(_ctx, () => {
                resolve(
                    _ctx)
            });
        } catch (e) {
            reject(e)
        }
    })
}
