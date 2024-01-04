export const tipsRenderPackage=class {
    constructor(){
        this.name='sac-tips-render'
    }
    meta='tips.json'
    config='tips.json'
    location='/data/public/sac-rss-adapters'
    topic='sac-tips-render'
    adapters=['github','npm','siyuan']
    singleFile=false
    descriptions={
        default:"思源小助手插件tips模块的渲染器"
    }
}