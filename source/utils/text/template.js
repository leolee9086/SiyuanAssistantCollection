export async function 加载模板引擎(artLocation) {
    let scriptEl = document.createElement("script");
    scriptEl.textContent = await (
        await fetch(artLocation)
    ).text();
    let iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.setAttribute("href", "about:blank");
    document.body.appendChild(iframe);
    iframe.contentDocument.head.appendChild(scriptEl);
    let template = iframe.contentWindow.template;
    setTimeout(iframe.remove())
    return template
}
const artLocation = '/plugins/blockAction/static/art-template-web.js'
export const genCompiler = (str)=>{
    return template.compile(str)
}
export const template = await 加载模板引擎(artLocation);
