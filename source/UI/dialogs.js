import kernelApi from '../polyfills/kernelApi.js'
import { AI对话框控制器,主AI对话框控制器 } from './dialogs/chatDialogs.js'
let 主AI对话框 = new 主AI对话框控制器()
export {主AI对话框 as 主AI对话框}
export { 监听菜单选中项变化 } from './menuWrapper.js'
import { clientApi,pluginInstance as plugin } from '../asyncModules.js'
//这里的clientApi只有在调用init之后再能使用
console.log(import.meta.resolve('./asyncModules.js'))
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
export const AI角色选择浮窗 = async (标题, ai角色列表) => {
    let dialog = new clientApi.Dialog({
        title: 标题,
        content: `<div id="ai-role-selection" class='fn__flex-column' style="pointer-events: auto;overflow:hidden"></div>`,
        width: '600px',
        height: 'auto',
        transparent: true,
        disableClose: false,
        disableAnimation: false
    }, () => {
    });

    let html = '';
    ai角色列表.forEach((角色, index) => {
        html += `<div class="ai-card">
                    <h2>${角色.name}</h2>
                    <p>${角色.description}</p>
                    <div class="ai-card-icons">
                        <button data-index="${index}" class="ai-card-icon ai-card-icon--settings">设置</button>
                        <button data-index="${index}" class="ai-card-icon ai-card-icon--activate">激活</button>
                    </div>
                 </div>`;
    });

    let container = dialog.element.querySelector("#ai-role-selection");
    container.innerHTML = html;

    return new Promise((resolve, reject) => {
        container.addEventListener("click", (e) => {
            if (e.target.classList.contains('ai-card-icon')) {
                dialog.destroy();
                if (e.target.classList.contains('ai-card-icon--activate')) {
                    resolve(ai角色列表[e.target.dataset.index]);
                } else if (e.target.classList.contains('ai-card-icon--settings')) {
                    // 这里可以添加设置AI角色的代码
                }
            } else {
                dialog.destroy();
                reject();
            }
        });
    });
};