import { plugin } from "../runtime.js";
let linkMap={}
export default [
    {
        label: "百度搜索",
        hints: '搜索,baidu,百度搜索',
        matchMod: 'any',
        icon: "",
        tipRender:async (context) => {
            let text = context.blocks[0].content
            let id = context.blocks[0].id
            let links = await  (plugin.搜索管理器.get('webseacher','baidu'))(text)
            links=links.join('\n')
            let lines =links.split('\n')
            linkMap[id]=linkMap[id]||{}

            lines.map(line=> {
                let obj = linkMap[id]
                if (!obj[line]){ 
                    obj[line]=true
                    return line
                }
            });

            let div = document.createElement('div');
            let aTags= plugin.lute.Md2HTML(links)
            div.innerHTML=aTags
            console.log(div,links,linkMap)
            return {element:div,markdown:links}
        }
    }
]