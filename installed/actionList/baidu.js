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

            lines= lines.map(line=> {
                let obj = linkMap[id]
                if (!obj[line.split(']')[0]]){ 
                    obj[line.split(']')[0]]=true
                    return line
                }
            });
            links=lines.join('\n')
            let div = document.createElement('div');
            let aTags= plugin.lute.Md2HTML(links)
            div.innerHTML=aTags
            if(div.innerText){
                return {element:div,markdown:links}
            }
        }
    }
]