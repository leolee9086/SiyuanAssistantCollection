import { clientApi, pluginInstance as plugin } from '../../asyncModules.js'
import { string2DOM } from '../builders/index.js';
import { 计算zindex } from './util/zIndex.js';
plugin.statusMonitor.set('菜单', '关键词菜单', '初次显示', true)
export const buildMenu = (title) => {
    if (!plugin.configurer.get('菜单设置', '启动时显示关键词动作菜单').$value
        && plugin.statusMonitor.get('菜单', '关键词菜单', '初次显示').$value
    ) {
        return
    }
    if (plugin.statusMonitor.get('菜单', '关键词菜单', '显示').$value
    ) {
        return
    }
    plugin.statusMonitor.set('菜单', '关键词菜单', '初次显示', false)
    plugin.statusMonitor.set('菜单', '关键词菜单', '显示', true)
    let menu = new clientApi.Dialog({
        title: title,
        content: `<div id="sacmenu" class='fn__flex-column' style="pointer-events: auto;overflow:hidden">
        </div>`,
        destroyCallback: () => {
            plugin.statusMonitor.set('菜单', '关键词菜单', '显示', false)
            plugin.statusMonitor.set('菜单', '关键词菜单', '菜单实例', { $value: [],$type: 'menu' })

        },
        width: '300px',
        height: 'auto',
        transparent: true,
        disableClose: true,
        disableAnimation: false
    }, () => {

    });
    plugin.statusMonitor.set('菜单', '关键词菜单', '菜单实例', { $value: [menu], $type: 'menu' })
    menu.origin = { x: 0, y: 0 }
    menu.position2origin = { x: 0, y: 0 }
    menu.element.style.pointerEvents = 'none'
    menu.element.style.zIndex = 计算zindex('.layout__resize--lr.layout__resize')
    menu.element.querySelector(".b3-dialog__container").style.pointerEvents = 'auto'
    menu.element.querySelector(".b3-dialog__container").style.position = 'fixed'
    menu.element.querySelector(".b3-dialog__container").classList.add("b3-menu")
    let button = string2DOM(`<button class="b3-menu__item"><svg class="b3-menu__icon" style="">
    <use xlink:href="#iconHelp"></use>
    </svg>
    <span class="b3-menu__label" style="  display: inline-block;
    width: 200px; 
    white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis; 
    ">打开帮助</span></button>`)
    button.addEventListener(
        'click', (e) => {
            plugin.eventBus.emit(`openHelp-plugin-${plugin.name}`)
        }
    )
    let container = menu.element.querySelector(".b3-dialog__container");
    container.appendChild(button)
    container.addEventListener('mouseover', function (event) {
        // 通过事件委托，找到具有 'b3-menu__item' 类名的元素
        let target = event.target;
        while (target !== container && !target.classList.contains('b3-menu__item')) {
            target = target.parentNode;
        }
        // 如果找到了具有 'b3-menu__item' 类名的元素
        if (target !== container) {
            // 移除所有条目的 'b3-menu__item--current' 类名
            let items = container.querySelectorAll('.b3-menu__item');
            items.forEach(item => item.classList.remove('b3-menu__item--current'));
            // 为当前元素加上 'b3-menu__item--current' 类名
            target.classList.add('b3-menu__item--current');
        }
    });
    container.querySelector('.b3-dialog__header').addEventListener(
        "dblclick", () => {
            console.log(menu.pined)
            menu.pined = !menu.pined
        }
    )
    menu.switchCurrent = (code) => {
        let items = Array.from(menu.element.querySelectorAll('.b3-menu__item'));
        let currentIndex = items.findIndex(item => item.classList.contains('b3-menu__item--current'));
        // 如果没有选中的菜单项，选择第一个菜单项
        if (currentIndex === -1) {
            items[0].classList.add('b3-menu__item--current');
            return;
        }
        if (code === 'ArrowUp') {
            // 如果当前选中的是第一个菜单项，那么选择最后一个菜单项
            let previousIndex = (currentIndex > 0) ? currentIndex - 1 : items.length - 1;
            items[currentIndex].classList.remove('b3-menu__item--current');
            items[previousIndex].classList.add('b3-menu__item--current');
        } else if (code === 'ArrowDown') {
            // 如果当前选中的是最后一个菜单项，那么选择第一个菜单项
            let nextIndex = (currentIndex < items.length - 1) ? currentIndex + 1 : 0;
            items[currentIndex].classList.remove('b3-menu__item--current');
            items[nextIndex].classList.add('b3-menu__item--current');
        }
    }
    let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                let style = window.getComputedStyle(container);
                let x = parseInt(style.left, 10);
                let y = parseInt(style.top, 10);
                menu.position2origin = { x: x - menu.origin.x || 0, y: y - menu.origin.y || 0 };
            }
        });
    });

    // 配置观察选项
    let config = { attributes: true, attributeFilter: ['style'] };
    // 开始观察
    observer.observe(container, config);
    menu.moveTo = (options) => {
        menu.element.style.zIndex = 计算zindex('.layout__resize--lr.layout__resize,.block__popover--open')
        if (menu.pined) {
            return
        }
        const { x, y, isLeft } = options;
        let container = menu.element.querySelector(".b3-dialog__container");
        let containerRect = container.getBoundingClientRect();
        // 计算新的位置
        let newX = menu.position2origin.x + x;
        let newY = menu.position2origin.y + y;
        // 获取窗口的宽度和高度
        let windowWidth = window.innerWidth || document.documentElement.clientWidth;
        let windowHeight = window.innerHeight || document.documentElement.clientHeight;
        // 检查是否超出窗口的右边界
        if (newX + containerRect.width > windowWidth) {
            newX = windowWidth - containerRect.width;
        }
        // 检查是否超出窗口的下边界
        if (newY + containerRect.height > windowHeight) {
            newY = windowHeight - containerRect.height;
        }
        // 更新位置
        container.style.left = `${newX}px`;
        container.style.top = `${newY}px`;
        // 如果菜单面板的高度过大，限制其最大高度并添加滚动条
        if (containerRect.height > windowHeight) {
            container.querySelector("#sacmenu").style.maxHeight = `${windowHeight}px`;
            container.querySelector("#sacmenu").style.overflowY = 'scroll';
        }
        // 更新 origin
        menu.origin = { x: newX, y: newY };
    }
    menu.clear = () => {
        menu.element.querySelector("#sacmenu").innerHTML = ""
    }
    menu.switchPin = () => {
        menu.pined = !menu.pined
    }
    return menu
}
export default buildMenu