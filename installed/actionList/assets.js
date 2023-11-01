import { clientApi as siyuan } from "../runtime.js"
export default [
    {
        icon: 'iconTrash',
        label: '获取标题',
        hints: '标题,链接标题',
        matcher:(word,hints,context)=>{
            if (context.allTokens) {
                if (context.allTokens.parentElement) {
                    let element = context.allTokens.parentElement
                    if (element.dataset.type === 'a') {
                        let href = element.dataset.href
                        if (href) {
                            return true
                        }
                    }
                }
            }
        },
        hintAction: async (context) => {
            if (context.allTokens) {
                if (context.allTokens.parentElement) {
                    let element = context.allTokens.parentElement
                    if (element.dataset.type === 'a') {
                        let href = element.dataset.href
                        if (href) {
                            let title = await getTitle(href)
                            element.innerText = title
                            let event = new Event('input')
                            context.protyle.protyle.wysiwyg.element.dispatchEvent(event)
                        }
                    }
                }
            }
        }
    }
]
const getTitle = async (href) => {
    let title = null;
    if (href.startsWith("http")) {
        let data = await forwardProxy(href, [{
            'User-Agent':
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36 Edg/116.0.1938.76"
        }]);
        let html = data?.body;
        //获取 html 的 dom 当中 head 内部的 title 标签的内容
        let titleReg = /<title>(.*)<\/title>/;
        let matchRes = html?.match(titleReg);
        if (matchRes) {
            title = matchRes[1];
        }
    }
    return title;
}
async function forwardProxy(url, headers = [], timeout = 5000) {
    let data = {
        url: url,
        method: 'GET',
        timeout: timeout,
        contentType: "text/html",
        headers: headers
    }
    let url1 = '/api/network/forwardProxy';
    return request(url1, data);
}

async function request(url, data) {
    let response = await siyuan.fetchSyncPost(url, data);
    let res = response.code === 0 ? response.data : null;
    return res;
}