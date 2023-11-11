import { createElementWithTagname } from "../../../../../UI/builders/index.js";
export const 创建用户消息卡片=(message)=>{
    let { content, id } = message
    const userMessage = createElementWithTagname("div", ["user-message", "fn__flex"], `<div class="fn__flex"><strong>User:</strong> ${content}</div>`);
    userMessage.appendChild(createElementWithTagname('div', ["fn__space", "fn__flex-1"], ``))
    userMessage.setAttribute('data-message-id', id)
    return userMessage
}