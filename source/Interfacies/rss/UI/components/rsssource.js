import { sac } from "../../../../asyncModules.js"
import { hasClosestByAttribute } from "../../../../utils/DOMFinder.js"

const handlerClick=(event)=>{
    event.preventDefault()
    event.stopPropagation()
    let closestRssAdapterSource = hasClosestByAttribute(event.target, 'data-repo-source')
    if (closestRssAdapterSource) {
        console.log(closestRssAdapterSource.getAttribute('data-repo-name'))
        sac.事件管理器.emit('rss-ui', 'install-adapter',{
            packageSource: closestRssAdapterSource.getAttribute('data-repo-source'),
            packageRepo:closestRssAdapterSource.getAttribute('data-repo-name'),
            packageName:closestRssAdapterSource.getAttribute('data-rss-name'),

        })

    } 
}
export function 渲染rss添加界面(元素, rss内容源名称) {
    console.log(元素, rss内容源名称)
    元素.removeEventListener('click',handlerClick)

    元素.addEventListener('click',handlerClick)
    sac.路由管理器.internalFetch('/search/rss/listAdapters/github', {
        method: "POST",
        body: {
            adapter: "GITHUB"
        }
    }).then(
        data => {
            let repos = data.body
            元素.innerHTML = ''
            repos.forEach(
                repo => 元素.innerHTML += `        
                <div class="fn__flex-1 fn__flex b3-card b3-card--wrap sac-rss-card" data-repo-name='${repo.name}' style="max-height:100px" >
                <div class="b3-card__body fn__flex"  style="font-size:small !important;padding:0">
                    <div class="b3-card__img">
                            <img style="width:74px;height:74px" src="${repo.iconUrl}"></img>
                    </div>
                    <div class="fn__flex-1 fn__flex-column">
                        <div class="b3-card__info b3-card__info--left fn__flex-1">
                             <span class="ft__on-surface ft__smaller">${repo.name}</span>
                                <div class="b3-card__desc" title="${repo.name}">
                                    ${repo.name}
                                </div>
                        </div> 
                    </div>
                    <div class="b3-card__actions b3-card__actions--right">
                        <span class="block__icon block__icon--show ariaLabel" aria-label="安装" data-rss-name='${repo.name}' data-repo-name='${repo.repoUrl}' data-repo-source="github">
                            <svg ><use xlink:href="#iconDownload"></use></svg>
                        </span>
                        <span class="block__icon block__icon--show ariaLabel" data-rss-name='${repo.readme}' aria-label="查看详情">
                        <svg ><use xlink:href="#iconList"></use></svg>
                    </span>
                    </div>
                </div>
            </div>
    `
            )
        }
    )
}