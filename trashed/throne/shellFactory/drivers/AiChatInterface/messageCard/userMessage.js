import { string2DOM } from "../../../../../UI/builders/index.js";
export const 创建用户消息卡片 = (message,doll) => {
    let { content, id } = message;
    const userMessage = string2DOM(`
        <div class="user-message fn__flex" data-message-id="${id}">
            <div class="fn__flex"><strong>User:</strong> ${content}</div>
            <div class="fn__space fn__flex-1"></div>
            <span ><svg class="b3-menu__icon" data-action="trash" style=""><use xlink:href="#iconTrashcan"></use></svg></span>

        </div>
    `);
    let trashButton = userMessage.querySelector('[data-action="trash"]')
    trashButton.addEventListener('click', () => { doll.emit('human-forced-forget-to', id) })
    return userMessage;
}