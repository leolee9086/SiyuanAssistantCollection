import kernelApi from '../../polyfills/kernelApi.js'
import { clientApi,pluginInstance as plugin } from '../../asyncModules.js'
import throneManager from '../../throne/index.js'

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
