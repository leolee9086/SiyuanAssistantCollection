import { kernelApi } from "../runtime.js";
const actions = ()=>{
    const templates= kernelApi.searchTemplate.sync({k:""})
    return templates.blocks.map(
        (item)=>{
            return {
                icon:"",
                label:item.path.split('\\').pop(),
                hints:item.path+','+'tempalte'+','+'模板',
                hintAction: (context) => {
                    const {content}=kernelApi.renderTemplate.sync({
                        id:context.blocks[0].root.id,
                        path:item.path
                    })
                    context.blocks[0].insertAfter(content,'html')
                    context.token.delete()               
                },
            }
        }
    )
}
export default actions