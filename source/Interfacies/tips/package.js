export const tipsRenderPackage=class {
    constructor(){
        this.name='sac-tips-render'
    }
    meta='tips.json'
    config='tips.json'
    location='/data/public/sac-tips-render/installed'
    topic='sac-tips-render'
    adapters=['github','npm','siyuan']
    singleFile=false
    descriptions={
        default:"思源小助手插件tips模块的渲染器"
    }
    load=async(packageName)=>{
        let path = await this.local.resolve(packageName,'index.js')
        let module = await import(path.replace('/data','')) 
        return module.tipsRender
    }
}