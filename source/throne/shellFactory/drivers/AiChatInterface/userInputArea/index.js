import { string2DOM } from "../../../../../UI/builders/index.js";
export const 创建用户输入框 = () => {
    const 用户输入框 = string2DOM(`
        <textarea id="user-input" placeholder="请输入内容"></textarea>
    `);
    return 用户输入框;
}
export const 创建用户输入区=()=>{
    const 用户输入区= string2DOM(
        `<div class='user-input-container'></div>`
    )
    return 用户输入区
}