import { EventEmitter } from '../../../../../eventsManager/EventEmitter.js';
import { string2DOM } from '../../../../../UI/builders/index.js';
export const 创建输入菜单按钮 = () => {
    const 输入框菜单按钮 = string2DOM(`
        <button class="ai-quote-btn">
            <svg>
                <use xlink:href="#iconList"></use>
            </svg>
        </button>
    `);
    return 输入框菜单按钮;
}