export const aiPersonaPackage=class{
    constructor(){
        this.name='sac-ai-persona'
    }
    meta='persona.json'
    config='persona.json'
    location='/data/public/sac-ai-persona/installed'
    topic='sac-ai-persona'
    adapters=['github','npm','siyuan']
    singleFile=false
    descriptions={
        default:"思源小助手插件ai模块的persona定义"
    }
    load=async(packageName)=>{
        let path = await this.local.resolve(packageName,'index.js')
        let module = await import(path.replace('/data','')) 
        return module
    }
}