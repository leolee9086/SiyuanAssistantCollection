import { sac } from "../../../../asyncModules.js"
import { hasClosestByAttribute } from "../../../../utils/DOMFinder.js"
let handleClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    let closestRssAdapterName = hasClosestByAttribute(event.target, 'data-rss-adapter-source')
    if (closestRssAdapterName) {
        console.log(closestRssAdapterName.getAttribute('data-rss-adapter-source'))
    } else {
        let closestRssName = hasClosestByAttribute(event.target, 'data-rss-name')
        if (closestRssName) {
            sac.事件管理器.emit('rss-ui', 'show-tab', closestRssName.getAttribute('data-rss-name'))
        }
    }
}
export const buildRssListUI = async (container, rssList) => {
    if (container && container.element) {
        container.element.querySelector('#SAC-RSS-List').removeEventListener('click', handleClick)
        container.element.querySelector('#SAC-RSS-List').addEventListener('click', handleClick)
        container.element.querySelector('#SAC-RSS-List').innerHTML = ''
        container.element.querySelector('#SAC-RSS-List').innerHTML += `
        <div class="fn__flex-1 fn__flex b3-card b3-card--wrap sac-rss-card" >
            <div class="b3-card__body fn__flex"  style="font-size:small !important;padding:0">
                <div class="b3-card__actions b3-card__actions--right">
                    <span class="block__icon block__icon--show ariaLabel"
                    data-rss-adapter-source="github"
                    aria-label="从GitHub添加">
                        <svg ><use xlink:href="#iconGithub"></use></svg>
                    </span>
                    <span 
                    class="block__icon block__icon--show ariaLabel" 
                    aria-label="从npmjs添加"
                    data-rss-adapter-source="npmjs"
                    >
                    <svg ><use xlink:href="#iconNPM"></use></svg>
                </span>
                <span 
                class="block__icon block__icon--show ariaLabel"
                 aria-label="从远程思源添加"
                 data-rss-adapter-source="siyuan"

                 >
                <svg ><use xlink:href="#iconSIYUAN"></use></svg>
                </div>
            </div>
        </div>
        `;
        for (const item of rssList) {
            // 这里可以进行异步操作
            try {
                container.element.querySelector('#SAC-RSS-List').innerHTML += `
        <div class="fn__flex-1 fn__flex b3-card b3-card--wrap sac-rss-card" data-rss-name='${item}' >
            <div class="b3-card__body fn__flex"  style="font-size:small !important;padding:0">
                <div class="b3-card__img">
                        <svg style="width:74px;height:74px"><use xlink:href="#iconRSS"></use></svg>
                </div>
                <div class="fn__flex-1 fn__flex-column">
                    <div class="b3-card__info b3-card__info--left fn__flex-1">
                         <span class="ft__on-surface ft__smaller">${item}</span>
                            <div class="b3-card__desc" title="${item.title}">
                                ${item.description}
                            </div>
                    </div> 
                </div>
                <div class="b3-card__actions b3-card__actions--right">
                    <span class="block__icon block__icon--show ariaLabel" aria-label="编辑rss规则">
                        <svg ><use xlink:href="#iconEdit"></use></svg>
                    </span>
                    <span class="block__icon block__icon--show ariaLabel" data-rss-name='${item}' aria-label="查看内容">
                    <svg ><use xlink:href="#iconList"></use></svg>
                </span>
                <span class="block__icon block__icon--show ariaLabel" aria-label="允许伺服">
                <input class="b3-switch fn__flex-center" checked="" data-type="plugin-enable" type="checkbox">                            </span>
                </div>
            </div>
        </div>
        `;
                getMeta(item).then(data => {
                    console.log(data)
                    if (data) {
                        container.element.querySelector(`[data-rss-name="${item}"]`).querySelector('.b3-card__desc').innerHTML = data.body.description
                    }
                })
            } catch (e) {
                console.warn(e)
            }
        }
    }

}
let getMeta = async (rssname) => {
    return await sac.路由管理器.internalFetch('/search/rss/meta', {
        body: {
            name: rssname
        },
        method: "POST"
    })
}