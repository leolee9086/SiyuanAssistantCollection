import { string2DOM } from "../../../../../UI/builders/index.js";
import { plugin } from "../../../../../asyncModules.js";
export const 创建提交按钮 = () => {
    const 提交按钮 = string2DOM(`
        <button id="submit-btn" class="ai-submit-btn">${plugin.i18n.提交}</button>
    `);
    return 提交按钮;
}