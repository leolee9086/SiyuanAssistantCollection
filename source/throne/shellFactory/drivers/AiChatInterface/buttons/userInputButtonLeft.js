import { EventEmitter } from '../../../../../eventsManager/EventEmitter.js';
export const 创建输入菜单按钮=()=>{
    const 输入框菜单按钮 = document.createElement('button');
    输入框菜单按钮.innerHTML = `<svg><use xlink:href="#iconList"></use><svg>`;
    输入框菜单按钮.classList.add('ai-quote-btn')
    return 输入框菜单按钮

}