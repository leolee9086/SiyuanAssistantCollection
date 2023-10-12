import { clientApi,plugin } from "../../asyncModules.js";
import { panelElement } from "../search/vectorSearchUI.js";
export const 向量搜索窗口 = async ()=>{
    let dialog = new clientApi.Dialog({
        title: '搜索',
        content: `<div id="ai-vectorSearch" class='fn__flex-column' style="pointer-events: auto;overflow:hidden"></div>`,
        width: '600px',
        height: 'auto',
        transparent: true,
        disableClose: false,
        disableAnimation: false
    }, () => {
    });
    dialog.element.querySelector("#ai-vectorSearch").appendChild(panelElement)
    let searchPreview = panelElement.querySelector('#searchPreview')
    new clientApi.Protyle({
        
    })
}
向量搜索窗口()