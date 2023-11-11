import { createElementWithTagname,string2DOM } from "../../../../../UI/builders/index.js";

export const 创建用户消息卡片 = (message) => {
    let { content, id } = message;
    const userMessage = string2DOM(`
        <div class="user-message fn__flex" data-message-id="${id}">
            <div class="fn__flex"><strong>User:</strong> ${content}</div>
            <div class="fn__space fn__flex-1"></div>
        </div>
    `);
    return userMessage;
}