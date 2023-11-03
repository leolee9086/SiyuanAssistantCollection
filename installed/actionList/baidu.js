import { plugin } from "../runtime.js";
export default [
    {
        label: "百度搜索",
        hints: '搜索,baidu,百度搜索',
        matchMod: 'any',
        icon: "",
        tipRender:async (context) => {
            let text = context.blocks[0].content
            let links = await  (plugin.搜索管理器.get('webseacher','baidu'))(text)
            let div = document.createElement('div');
            let aTags= plugin.lute.Md2HTML(links)
            div.innerHTML=aTags
            return {element:div,markdown:links}
        }
    }
]