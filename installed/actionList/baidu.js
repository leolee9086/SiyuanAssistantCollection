import { plugin } from "../runtime.js";
let {搜索管理器} = plugin
export default [
    {
        label: "百度搜索",
        hints: '搜索,baidu,百度搜索',
        matchMod: 'any',
        icon: "",
        tipRender: async (context) => {
            let text = context.token.word
            if (text.length >= 2) {
                let links = await (搜索管理器.get('webseacher', 'baidu'))(text, { rss: true })
                if(links.results){
                    let results = JSON.parse(JSON.stringify(links.results))
                    return {
                        title: "百度搜索",
                        link: "",
                        description: "",
                        items: results
                    }
                }else{
                    return 
                }
            }
        }
    }
]