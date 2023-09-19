import { kernelApi,BlockHandler } from "../runtime.js"

export default (context) => {
    let recentDocs = kernelApi.getRecentDocs.sync({});
    return recentDocs.map(
        doc => {
            return {
                label: '打开:' + doc.title,
                hints: doc.title,
                hintAction:async (context)=>{
                    await (new BlockHandler(doc.rootID,kernelApi)).open()
                    window.siyuan.menus.menu.remove()
                }
            }
        }
    )
}