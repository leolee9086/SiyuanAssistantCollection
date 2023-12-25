//这里的require注入了plugin对象
const plugin = require('plugin');
const clientApi = require('clientApi');
let topBarButton = plugin.addTopBar(
  {
    icon: 'iconSparkles',
    title: '打开对话框,右键打开设置',
    position: 'right',
  }
)
plugin.statusMonitor.set('UI', 'topBarButton', topBarButton)
function 创建aiTab容器() {
  const DOCK_TYPE = 'SAC_Tab'
  plugin.TabContainer = plugin.addTab({
    type: DOCK_TYPE,
    init() {
      plugin.log(plugin)
      console.log(this)
      this.element.innerHTML = `<div id="sac-interface" class='fn__flex-column' style="pointer-events: auto;overflow:hidden;max-height:100%"></div>`;
      plugin.eventBus.emit(this.data.channel + '-' + 'tab-inited', this)
    },
    destroy() {
      plugin.log("destroy tab:", DOCK_TYPE);
    }
  });
  plugin.eventBus.on('open-tab', (e) => {

    let data =JSON.parse(JSON.stringify( e.detail.data.data))
  
    clientApi.openTab({
      app: plugin.app,
      custom: {
        title:data.title + "",
        icon: data.icon || "icon",
        data: {
          channel: e.detail.emitter.channel,
          icon: data.icon || "icon",
          title: data.title,

          ...data
        },
        id: plugin.name + DOCK_TYPE
      }
    }).then(
      _tab => {
        _tab.emitter = e.detail.emitter
        plugin.eventBus.emit(e.detail.emitter.channel + '-' + 'tab-opened', _tab.model)
      }
    )
  })
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
      plugin.eventBus.emit('tipsConainerInited', this)
    },
    destroy() {
      plugin.log("destroy dock:", DOCK_TYPE);
    }
  });
}
创建TIPS侧栏容器()

function 创建RSS侧栏容器() {
  const DOCK_TYPE = 'SAC_RSS'
  plugin.addDock({
    config: {
      position: "LeftBottom",
      size: { width: 200, height: 0 },
      icon: "iconRSS",
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
              <use xlink:href="#iconRSS"></use>
          </svg>
          RSS
      </div>
  </div>
  <div class="fn__flex-1 fn__flex-column" style="min-height: auto;transition: var(--b3-transition)">
    <div id="SAC-RSS-List" class='fn__flex-1 b3-cards' style="overflow:auto;max-height:100%;background-color:var(--b3-theme-background)"></div>
  </div>
  </div>
  <div class="fn__flex">
      `;
      plugin.statusMonitor.set('RssDockConainer', 'main', this)
      plugin.eventBus.emit('rss-dock-conainer-inited', this)
    },
    destroy() {
      plugin.log("destroy dock:", DOCK_TYPE);
    }
  });
}
创建RSS侧栏容器()


plugin.addIcons(`<symbol id="iconFace" viewBox="0 0 32 32">
<path d="M13.667 17.333c0 0.92-0.747 1.667-1.667 1.667s-1.667-0.747-1.667-1.667 0.747-1.667 1.667-1.667 1.667 0.747 1.667 1.667zM20 15.667c-0.92 0-1.667 0.747-1.667 1.667s0.747 1.667 1.667 1.667 1.667-0.747 1.667-1.667-0.747-1.667-1.667-1.667zM29.333 16c0 7.36-5.973 13.333-13.333 13.333s-13.333-5.973-13.333-13.333 5.973-13.333 13.333-13.333 13.333 5.973 13.333 13.333zM14.213 5.493c1.867 3.093 5.253 5.173 9.12 5.173 0.613 0 1.213-0.067 1.787-0.16-1.867-3.093-5.253-5.173-9.12-5.173-0.613 0-1.213 0.067-1.787 0.16zM5.893 12.627c2.28-1.293 4.040-3.4 4.88-5.92-2.28 1.293-4.040 3.4-4.88 5.92zM26.667 16c0-1.040-0.16-2.040-0.44-2.987-0.933 0.2-1.893 0.32-2.893 0.32-4.173 0-7.893-1.92-10.347-4.92-1.4 3.413-4.187 6.093-7.653 7.4 0.013 0.053 0 0.12 0 0.187 0 5.88 4.787 10.667 10.667 10.667s10.667-4.787 10.667-10.667z"></path>
</symbol>
<symbol id="iconSaving" viewBox="0 0 32 32">
<path d="M20 13.333c0-0.733 0.6-1.333 1.333-1.333s1.333 0.6 1.333 1.333c0 0.733-0.6 1.333-1.333 1.333s-1.333-0.6-1.333-1.333zM10.667 12h6.667v-2.667h-6.667v2.667zM29.333 10v9.293l-3.76 1.253-2.24 7.453h-7.333v-2.667h-2.667v2.667h-7.333c0 0-3.333-11.28-3.333-15.333s3.28-7.333 7.333-7.333h6.667c1.213-1.613 3.147-2.667 5.333-2.667 1.107 0 2 0.893 2 2 0 0.28-0.053 0.533-0.16 0.773-0.187 0.453-0.347 0.973-0.427 1.533l3.027 3.027h2.893zM26.667 12.667h-1.333l-4.667-4.667c0-0.867 0.12-1.72 0.347-2.547-1.293 0.333-2.347 1.293-2.787 2.547h-8.227c-2.573 0-4.667 2.093-4.667 4.667 0 2.507 1.627 8.867 2.68 12.667h2.653v-2.667h8v2.667h2.68l2.067-6.867 3.253-1.093v-4.707z"></path>
</symbol>
<symbol id="iconRSS" viewBox="0 0 1024 1024"  ><path d="M832.512 63.488q26.624 0 49.664 10.24t40.448 27.648 27.648 40.448 10.24 49.664l0 704.512q0 26.624-10.24 49.664t-27.648 40.448-40.448 27.648-49.664 10.24l-704.512 0q-26.624 0-49.664-10.24t-40.448-27.648-27.648-40.448-10.24-49.664l0-704.512q0-26.624 10.24-49.664t27.648-40.448 40.448-27.648 49.664-10.24l704.512 0zM188.416 923.648q19.456 0 36.864-7.168t30.208-19.968 19.968-30.208 7.168-36.864-7.168-36.864-19.968-30.208-30.208-19.968-36.864-7.168q-20.48 0-37.376 7.168t-30.208 19.968-20.48 30.208-7.168 36.864 7.168 36.864 20.48 30.208 30.208 19.968 37.376 7.168zM446.464 897.024l36.864 0q15.36 0 30.208 0.512t31.232 0.512 36.864-1.024q0-93.184-35.84-175.616t-97.28-143.872-143.872-96.768-175.616-35.328q-1.024 24.576-1.024 39.936l0 28.672q0 14.336 0.512 29.184t0.512 37.376q65.536 0 123.392 24.576t100.864 67.584 68.096 100.864 25.088 123.392zM707.584 894.976q36.864 0 49.152 0.512t18.432 1.536 15.872 1.024 41.472-2.048q0-145.408-55.296-272.896t-150.528-222.72-223.232-150.528-273.408-55.296q-1.024 25.6-1.024 36.864l0 16.384q0 4.096 0.512 5.632t0.512 7.168 0.512 18.432 0.512 40.448q119.808 0 224.768 45.056t183.296 123.392 123.392 183.296 45.056 223.744z" p-id="2420"></path></symbol>

<symbol id="iconNPM" class="icon" viewBox="0 0 1000 1000" >
<path d="M117.149737 906.850263V117.160081h789.690182v789.690182z m148.521374-641.706667v492.533657h248.873374V367.843556h145.025293v389.906101h98.735321V265.143596z" fill="#CB3837" p-id="4188"></path>
</symbol>
<symbol id="iconSIYUAN" class="icon" viewBox="0 0 1000 1000" >
</symbol>
`)