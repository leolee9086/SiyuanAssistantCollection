//const art = require('art-template');

import { plugin } from "../../../../asyncModules.js";
import path from "../../../../polyfills/path.js";
//const json = require('@/views/json');
let scriptEl = document.createElement("script");
scriptEl.textContent = await (
  await fetch(path.join(plugin.selfPath, "static", "art-template-web.js").replace('/data',''))
).text();
let iframe = document.createElement("iframe");
iframe.style.display = "none";
iframe.setAttribute("href", "about:blank");
document.body.appendChild(iframe);
iframe.contentDocument.head.appendChild(scriptEl);
let art = iframe.contentWindow.template;

// We may add more control over it later
console.log(art)
let templateCache = {};

const _art = (url, data) => {
    // 如果缓存中有模板，直接使用
    if (templateCache[url]) {
        let render = art.compile(templateCache[url]);
        return render(data);
    }

    let template = document.createElement('template');

    // 创建一个同步的XMLHttpRequest
    let request = new XMLHttpRequest();
    request.open('GET', url, false);  // false表示同步
    request.send(null);

    if (request.status === 200) {
        // 如果请求成功，将响应文本设置为模板内容
        template.innerHTML = request.responseText;
        // 将模板内容存入缓存
        templateCache[url] = template.innerHTML;
    }

    // 使用art库渲染模板
    let render = art.compile(template.innerHTML);
    return render(data);
}
export default {
    art:_art,
    //json, // This should be used by RSSHub middleware only.
};
