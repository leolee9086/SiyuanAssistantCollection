import { clientApi, sac as plugin } from '../../asyncModules.js'
import { string2DOM } from '../builders/index.js';
import { 计算zindex } from '../../utils/DOM/zIndex.js';
plugin.statusMonitor.set('菜单', '关键词菜单', '初次显示', true)
function createContainer(title) {
    return new clientApi.Dialog({
        title: title,
        content: `<div id="sacmenu" class='fn__flex-column' style="pointer-events: auto;overflow:hidden"></div>`,
        destroyCallback: () => {
            plugin.statusMonitor.set('菜单', '关键词菜单', '显示', false)
            plugin.statusMonitor.set('菜单', '关键词菜单', '菜单实例', { $value: [], $type: 'menu' })
        },
        width: '300px',
        height: 'auto',
        transparent: true,
        disableClose: true,
        disableAnimation: false
    }, () => { });
}
function setStyle(menuContainer) {
    menuContainer.origin = { x: 0, y: 0 }
    menuContainer.position2origin = { x: 0, y: 0 }
    menuContainer.element.style.pointerEvents = 'none'
    menuContainer.element.style.zIndex = 计算zindex('.layout__resize--lr.layout__resize')
    menuContainer.element.querySelector(".b3-dialog__container").style.pointerEvents = 'auto'
    menuContainer.element.querySelector(".b3-dialog__container").style.position = 'fixed'
    menuContainer.element.querySelector(".b3-dialog__container").classList.add("b3-menu")
}
function addHelpButton(menuContainer) {
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
    let container = menuContainer.element.querySelector(".b3-dialog__container");
    container.appendChild(button)
}
function addPinEvent(menuContainer) {
    let container = menuContainer.element.querySelector(".b3-dialog__container");
    container.querySelector('.b3-dialog__header').addEventListener("dblclick", () => {
        console.log(menu.pined);
        menu.pined = !menu.pined;
    });
}
function addMouseoverEvent(menu) {
    let container = menu.element.querySelector(".b3-dialog__container");
    container.addEventListener('mouseover', function (event) {
        let target = event.target;
        while (target !== container && !target.classList.contains('b3-menu__item')) {
            target = target.parentNode;
        }
        if (target !== container) {
            let items = container.querySelectorAll('.b3-menu__item');
            items.forEach(item => item.classList.remove('b3-menu__item--current'));
            target.classList.add('b3-menu__item--current');
        }
    });
}
function checkMenuStatus() {
    if (!plugin.configurer.get('菜单设置', '启动时显示关键词动作菜单').$value
        && plugin.statusMonitor.get('菜单', '关键词菜单', '初次显示').$value
    ) {
        return false;
    }
    if (plugin.statusMonitor.get('菜单', '关键词菜单', '显示').$value) {
        return false;
    }
    plugin.statusMonitor.set('菜单', '关键词菜单', '初次显示', false);
    plugin.statusMonitor.set('菜单', '关键词菜单', '显示', true);
    return true;
}
function createMenuContainer (title){
    let menuContainer = createContainer(title);
    plugin.statusMonitor.set('菜单', '关键词菜单', '菜单实例', { $value: [menuContainer], $type: 'menu' });
    return menuContainer;

}
function setupMenu(menuContainer){
    setStyle(menuContainer)
    addHelpButton(menuContainer)
    addPinEvent(menuContainer)
    addMouseoverEvent(menuContainer)
}
function addSwitchCurrent(menuContainer){
    menuContainer.switchCurrent = (code) => {
        let items = Array.from(menuContainer.element.querySelectorAll('.b3-menu__item'));
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
}
function addObserver(menuContainer){
    let container = menuContainer.element.querySelector(".b3-dialog__container");

    let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                let style = window.getComputedStyle(container);
                let x = parseInt(style.left, 10);
                let y = parseInt(style.top, 10);
                menuContainer.position2origin = { x: x - menuContainer.origin.x || 0, y: y - menuContainer.origin.y || 0 };
            }
        });
    });

    // 配置观察选项
    let config = { attributes: true, attributeFilter: ['style'] };
    // 开始观察
    observer.observe(container, config);

}
function addMoveTo(menuContainer){
    menuContainer.moveTo = (options) => {
        menuContainer.element.style.zIndex = 计算zindex('.layout__resize--lr.layout__resize,.block__popover--open')
        if (menuContainer.pined) {
            return
        }
        const { x, y, isLeft } = options;
        let container = menuContainer.element.querySelector(".b3-dialog__container");
        let containerRect = container.getBoundingClientRect();
        // 计算新的位置
        let newX = menuContainer.position2origin.x + x;
        let newY = menuContainer.position2origin.y + y;
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
        menuContainer.origin = { x: newX, y: newY };
    }
}

export const buildMenu = (title) => {
    if(!checkMenuStatus()){
        return
    }
    let menuContainer = createMenuContainer(title);
    setupMenu(menuContainer)
    addSwitchCurrent(menuContainer)
    addObserver(menuContainer)
    addMoveTo(menuContainer)
    menuContainer.clear = () => {
        menuContainer.element.querySelector("#sacmenu").innerHTML = ""
    }
    menuContainer.switchPin = () => {
        menuContainer.pined = !menuContainer.pined
    }
    return menuContainer
}
export default buildMenu