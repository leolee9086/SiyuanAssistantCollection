import kernelApi from '../../polyfills/kernelApi.js'
import { clientApi,pluginInstance as plugin } from '../../asyncModules.js'

export const 选择最近文档 = async () => {
    let recentDocs = kernelApi.getRecentDocs.sync({});
    return await 从块列表中选择(recentDocs, '最近文档')
}
export const 从块列表中选择 = (块列表, 标题) => {
    return new Promise((resolve, reject) => {
        let html = ``;
        块列表.forEach((块数据, index) => {
            html += `<li data-index="0" data-node-id="${块数据.rootID || 块数据.root_id}" class="b3-list-item b3-list-item">
                      <span class="b3-list-item__text" data-node-id="${块数据.rootID || 块数据.root_id}">${块数据.title || 块数据.name || 块数据.content.substring(0, 16)}</span>
                      </li>`;
        });
        let dialog = new clientApi.Dialog({
            title: 标题,
            content: `<div class="b3-dialog__content fn__flex-column switch-doc">
                  <div></div>
                  <ul class="b3-list b3-list--background fn__flex-1">
                  ${html}
                  </ul>
                  <div></div>
                  </div>`,
        });
        dialog.element.addEventListener("click", (e) => {
            if (e.target.dataset.nodeId) {
                dialog.destroy();
                resolve(e.target.dataset.nodeId);
            } else {
                dialog.destroy();
                reject();
            }
        });
    });
}
