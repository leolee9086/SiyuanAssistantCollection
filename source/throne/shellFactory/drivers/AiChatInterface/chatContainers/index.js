import { string2DOM } from "../../../../../UI/builders/index.js";
export const 创建聊天容器 = () => {
    const 聊天容器 = string2DOM(`
        <div id="chat-container" class="fn__flex-1"></div>
    `);
    return 聊天容器;
}