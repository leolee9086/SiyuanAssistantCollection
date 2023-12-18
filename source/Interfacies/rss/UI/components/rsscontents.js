import { sac } from "../../../../asyncModules.js"
export const 渲染rss内容=(容器元素,rss内容源名称)=>{
    console.log(容器元素,rss内容源名称)
    sac.路由管理器.internalFetch('/search/rss/enable', {
        body: {
            name:rss内容源名称
        }, method: 'POST'
    }).then(
        data => {
            容器元素.innerHTML += data.body
            容器元素.querySelectorAll('span[data-sac-href]').forEach(
                rss条目元素=>{
                    sac.路由管理器.internalFetch(rss条目元素.getAttribute('data-sac-href')).then(
                        data=>{
                            rss条目元素.innerHTML+=data.body
                        }
                    )
                }
            )
        }
    )
}