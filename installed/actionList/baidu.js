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
            let links = await  (plugin.搜索管理器.get('webseacher','baidu'))(text,{rss:true})
            let results=links.results
            return {
                title:"百度搜索",
                link:"",
                description:"",
                items:results
            }
        }
    }
]