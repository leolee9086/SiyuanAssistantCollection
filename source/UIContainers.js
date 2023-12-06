//这里的require注入了plugin对象
const plugin = require('plugin')
let topBarButton = plugin.addTopBar(
    {
        icon: 'iconSparkles',
        title: '打开对话框,右键打开设置',
        position: 'right',
    }
)
plugin.statusMonitor.set('UI', 'topBarButton', topBarButton)
function 创建aiTab容器(){
    const DOCK_TYPE = 'SAC_CHAT'
    plugin.aiTabContainer = plugin.addTab({
      type: DOCK_TYPE,
      init() {
        plugin.log(plugin)
        plugin.element.innerHTML = `<div id="ai-chat-interface" class='fn__flex-column' style="pointer-events: auto;overflow:hidden;max-height:100%"></div>`;
        let tabs = plugin.statusMonitor.get('aiTabContainer', plugin.data.persona).value || []
        tabs.push(plugin)
        plugin.statusMonitor.set('aiTabContainer', plugin.data.persona, tabs)
        plugin.eventBus.emit('TabContainerInited', plugin)
        plugin.log(plugin)

      },
      destroy() {
        plugin.log("destroy tab:", DOCK_TYPE);
      }
    });
}
创建aiTab容器()

function 创建AI侧栏容器() {
    const DOCK_TYPE = 'SAC_CHAT'
    plugin.addDock({
      config: {
        position: "LeftBottom",
        size: { width: 200, height: 0 },
        icon: "iconSaving",
        title: "Custom Dock",
      },
      data: {
        text: "This is my custom dock"
      },
      type: DOCK_TYPE,
      init() {
        this.element.innerHTML = `<div id="ai-chat-interface" class='fn__flex-column' style="pointer-events: auto;overflow:hidden;max-height:100%"></div>`;
        plugin.statusMonitor.set('dockContainers', 'main', this.element)
        plugin.eventBus.emit('dockConainerInited', this.element)
      },
      destroy() {
        plugin.log("destroy dock:", DOCK_TYPE);
      }
    });
  }
  创建AI侧栏容器()

  //这个被用来创建tips侧栏容器
  function 创建TIPS侧栏容器() {
    const DOCK_TYPE = 'SAC_TIPS'
    plugin.addDock({
      config: {
        position: "LeftBottom",
        size: { width: 200, height: 0 },
        icon: "iconFace",
        title: "Custom Dock",
      },
      data: {
        text: "This is my custom dock"
      },
      type: DOCK_TYPE,
      init() {
        this.element.innerHTML = `
        <div class="fn__flex-1 fn__flex-column" style="max-height:100%">
        <div class="block__icons">
        <div class="block__logo">
            <svg>
                <use xlink:href="#iconFiles"></use>
            </svg>
            TIPS
        </div>
    </div>
    <div class="fn__flex-1 fn__flex-column" style="min-height: auto;transition: var(--b3-transition)">
      <div id="SAC-TIPS_pinned"  style="overflow:auto;max-height:30%"></div>
      <div id="SAC-TIPS" class='fn__flex-1' style="overflow:auto;max-height:100%"></div>
    </div>
    </div>
    <div class="fn__flex">
        `;
        plugin.statusMonitor.set('tipsConainer', 'main', this.element)
        plugin.eventBus.emit('tipsConainerInited')
      },
      destroy() {
        plugin.log("destroy dock:", DOCK_TYPE);
      }
    });
  }
创建TIPS侧栏容器()