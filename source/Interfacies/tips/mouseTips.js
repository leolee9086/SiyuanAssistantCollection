 // 判断函数数组
 import { hasClosestByAttribute } from '../../utils/DOMFinder.js';
import { 显示tips } from './显示tips.js';
 const checkFunctions = [
    // 示例判断函数，你可以替换成实际的函数
    {
        check:    (element) => {
            return  hasClosestByAttribute (element,'contenteditable',true)
        },
        actions:()=>{
            显示tips()
        }
    },
    {
        check:(element)=>{
          return  hasClosestByAttribute(element,'data-hotkeylangid',"inbox")
        },
        actions:()=>{
            window.open("siyuan://blocks/20230808120348-hynr7og")
        }
    },
    {
        check:(element)=>{
          return  hasClosestByAttribute(element,'data-hotkeylangid',"globalGraph")
        },
        actions:()=>{
            window.open("siyuan://blocks/20200813132813-66ai5qn")
        }
    }

];


// 创建标记元素
function createMark(document) {
    const mark = document.createElement('div');
    mark.textContent = 'AI Ready';
    mark.style.position = 'fixed';
    mark.style.top = '0';
    mark.style.right = '0';
    mark.style.backgroundColor = 'light yellow';
    mark.style.color = 'green';
    mark.style.padding = '2px';
    mark.style.fontSize = '12px';
    mark.style.display = 'none';
    mark.style.transition = 'color 3s';
    mark.style.width = '20px';
    mark.style.height = '20px';
    mark.style.borderRadius = '100%';
    mark.style.zIndex = '10086';

    mark.innerHTML = '<svg style="width:100%;height:100%"><use xlink:href="#iconTips"></use></svg>';
    document.body.appendChild(mark);
    return mark;
}

// 节流函数
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function() {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}

// 更新标记位置
function updateMarkPosition(mark, mouseX, mouseY, offset, lastAnimationFrame) {
    if (lastAnimationFrame) {
        cancelAnimationFrame(lastAnimationFrame);
    }
    lastAnimationFrame = requestAnimationFrame(() => {
        mark.style.top = `${mouseY + offset}px`;
        mark.style.left = `${mouseX + offset}px`;
    });
    return lastAnimationFrame;
}
let lasttrigger
// 改变标记颜色
function changeMarkColorToGreen(mark, element, checkFunctions) {
    const results = checkFunctions.filter(checkFunc => checkFunc.check(element));
    if (results.length > 0&&lasttrigger!==element) {
        lasttrigger=element
        mark.style.color = 'yellow';
        mark.style.display = 'none';

        mark.style.boxShadow = '0 0 20px yellow';
        try{
        results.forEach(result => {
            result.actions(element);
        });
    }catch(e){

    }
        setTimeout(() => { 
            mark.style.boxShadow = '';
            mark.style.display='none';
            mark.style.color='rgba(0,0,0)'
        }, 300);
    }
}

// 主函数
// 主函数
export function markElementIfMouseOver(document) {
    const mark = createMark(document);
    const offset = 10;
    let lastAnimationFrame = null;
    const throttledUpdateMarkPosition = throttle((mouseX, mouseY) => {
        lastAnimationFrame = updateMarkPosition(mark, mouseX, mouseY, offset, lastAnimationFrame);
    }, 16);

    let colorChangeTimeout = null;
    let actionTimeout = null; // 新增一个用于触发动作和动画的timeout
    let glowEffectTimeout = null; // 新增一个用于触发发光特效的timeout
    let lastTarget = null;
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        throttledUpdateMarkPosition(mouseX, mouseY);
        lastTarget = e.target;
        if (colorChangeTimeout) clearTimeout(colorChangeTimeout); // 清除之前的timeout
        if (actionTimeout) clearTimeout(actionTimeout); // 清除之前的action timeout
        if (glowEffectTimeout) clearTimeout(glowEffectTimeout); // 清除之前的发光特效timeout

        colorChangeTimeout = setTimeout(() => {
            mark.style.display = 'block'; // 开始显示标记
            mark.style.color = 'rgba(0,0,0,0)'; // 初始透明度设置为0
            mark.style.transition = 'color 3s'; // 设置透明度变化的过渡时间为3秒
            mark.style.color = 'yellow'; // 触发透明度过渡到1

            // 设置一个timeout来在2.7秒后触发发光特效
            glowEffectTimeout = setTimeout(() => {
                mark.style.boxShadow = '0 0 10px yellow'; // 添加发光特效
            }, 2700);

            // 设置另一个timeout来在3秒后触发动作和动画
            actionTimeout = setTimeout(() => {
                changeMarkColorToGreen(mark, e.target, checkFunctions);
                // 重置标记样式
                mark.style.boxShadow = ''; // 移除发光特效
                mark.style.color = 'rgba(0,0,0,0)'; // 透明度过渡回0
                mark.style.display = 'none'; // 完全隐藏标记
            }, 3000);
        }, 1000);
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        mark.style.display = 'none';
        clearTimeout(colorChangeTimeout);
        clearTimeout(glowEffectTimeout); // 清除发光特效timeout
        clearTimeout(actionTimeout); // 清除动作timeout
    });
}