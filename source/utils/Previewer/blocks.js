import { clientApi, sac } from "../../asyncModules.js"

export const buildProtylePreview = (blockId,options,container)=>{
    let {Protyle}= clientApi
    let editor= new Protyle(
        sac.app,
        container,
        {
            blockId,
            render:options
        }
    )
    return editor
}
