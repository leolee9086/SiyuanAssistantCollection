//这里的require注入了plugin对象
const plugin = require('plugin');
const clientApi = require('clientApi');
let topBarAiButton = plugin.addTopBar(
  {
    icon: 'iconSparkles',
    title: '打开对话框,右键打开设置',
    position: 'right',
  }
)
plugin.statusMonitor.set('UI', 'topBarAiButton', topBarAiButton)
topBarAiButton.addEventListener('click', (e) => {
  plugin.eventBus.emit('click-ai-button', e)
})
let topBarBerryButton = plugin.addTopBar(
  {
    icon: 'iconBerry',
    title: '打开对话框,右键打开设置',
    position: 'right',
  }
)
topBarBerryButton.addEventListener('click', (e) => {
  plugin.eventBus.emit('click-berry-button', e)
})
plugin.statusMonitor.set('UI', 'topBarBerryButton', topBarBerryButton)

function 创建Tab容器() {
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
    let data = JSON.parse(JSON.stringify(e.detail.data.data))
    clientApi.openTab({
      app: plugin.app,
      custom: {
        title: data.title + "",
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
创建Tab容器()

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
  let tipsDocks = []
  plugin.statusMonitor.set('docks', 'tips-ui', tipsDocks)

  const DOCK_TYPE = 'SAC_TIPS'
  plugin.addDock({
    config: {
      position: "LeftBottom",
      size: { width: 200, height: 0 },
      icon: "iconTips",
      title: "Sac-tips",
    },
    data: {
      name: "TipsMain",
      channel: "tips-ui"
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
    <div id="sac-interface" class="fn__flex-1 fn__flex-column " style="min-height: auto;transition: var(--b3-transition)">
      <div id="SAC-TIPS_pinned"  style="overflow:auto;max-height:30%"></div>
      <div id="SAC-TIPS" class='fn__flex-1' style="overflow:auto;max-height:100%"></div>
    </div>
    </div>
    <div class="fn__flex">
        `;
      tipsDocks.push(this)

      plugin.statusMonitor.set('tipsConainer', 'main', this)
      plugin.eventBus.emit('tips-ui-dock-container-inited', this)
    },
    destroy() {
      plugin.log("destroy dock:", DOCK_TYPE);
    }
  });
}
创建TIPS侧栏容器()

function 创建RSS侧栏容器() {
  let rssDocks = []
  plugin.statusMonitor.set('docks', 'rss-ui', rssDocks)
  const DOCK_TYPE = 'SAC_RSS'
  plugin.addDock({
    config: {
      position: "LeftBottom",
      size: { width: 200, height: 0 },
      icon: "iconRSS",
      title: "Rss Dock",
    },
    data: {
      name: "rssSourceMonitor",
      channel: "rss-ui"
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
    <div id="sac-interface" class='fn__flex-1 b3-cards' style="overflow:auto;max-height:100%;background-color:var(--b3-theme-background)"></div>
  </div>
  </div>
  <div class="fn__flex">
      `;
      rssDocks.push(this)
      plugin.statusMonitor.set('RssDockConainer', 'main', this)
      plugin.eventBus.emit('rss-ui-dock-container-inited', this)
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
<symbol  id="iconBerry" viewBox='0 0 1024 1024'>
<path d="M868.352 635.904V386.048c34.304-6.144 61.952-38.4 61.952-74.752 0-42.496-34.304-74.752-74.752-74.752-21.504 0-42.496 10.752-55.296 25.6l-213.504-119.296c2.048-6.144 4.096-12.8 4.096-21.504 0-42.496-34.304-74.752-74.752-74.752s-74.752 34.304-74.752 74.752c0 6.144 2.048 12.8 2.048 19.456L230.4 262.656c-16.896-16.896-36.352-27.648-57.344-27.648-42.496 0-74.752 34.304-74.752 74.752 0 36.352 25.6 66.048 59.904 74.752v251.904c-34.304 8.704-59.904 38.4-59.904 74.752 0 42.496 34.304 74.752 74.752 74.752 21.504 0 42.496-10.752 55.296-25.6l215.552 119.296c-4.096 8.704-6.144 19.456-6.144 29.696 0 42.496 34.304 74.752 74.752 74.752s74.752-34.304 74.752-74.752c0-10.752-2.048-21.504-6.144-31.744l215.552-117.248c14.848 14.848 34.304 25.6 57.344 25.6 42.496 0 74.752-34.304 74.752-74.752 1.536-39.424-24.064-69.12-60.416-75.264z m-309.248 212.992c-8.704-6.144-16.896-10.752-25.6-12.8v-189.952h-36.352v189.952c-10.752 2.048-21.504 8.704-29.696 14.848l-219.648-121.856c2.048-6.144 2.048-12.8 2.048-19.456 0-34.304-23.552-64-55.296-72.704V384c12.8-4.096 23.552-8.704 31.744-19.456l159.744 98.304 19.456-29.696-160.256-98.304c2.048-8.704 4.096-14.848 4.096-23.552 0-6.144-2.048-12.8-2.048-19.456L460.8 170.496c12.8 14.848 34.304 23.552 55.296 23.552 21.504 0 40.448-8.704 53.248-23.552l213.504 121.856c-2.048 6.144-2.048 12.8-2.048 19.456 0 8.704 2.048 14.848 4.096 23.552l-159.744 98.304 19.456 29.696 157.696-96.256c8.704 8.704 19.456 14.848 31.744 19.456V640c-31.744 8.704-53.248 38.4-53.248 72.704 0 6.144 0 12.8 2.048 16.896l-223.744 119.296z" fill="#2B85FB" p-id="3731"></path><path d="M443.392 583.68c38.4 38.4 100.352 38.4 138.752 0s38.4-100.352 0-138.752-100.352-38.4-138.752 0c-38.4 37.888-38.4 100.352 0 138.752z"></path>
</symbol>
<symbol  id="iconSacWarning" viewBox='0 0 1024 1024'>
<path d="M934.4 770.133333L605.866667 181.333333C586.666667 147.2 550.4 128 512 128s-74.666667 21.333333-93.866667 53.333333L89.6 770.133333c-19.2 34.133333-19.2 76.8 0 110.933334S145.066667 938.666667 183.466667 938.666667h657.066666c40.533333 0 74.666667-21.333333 93.866667-57.6 19.2-34.133333 19.2-76.8 0-110.933334zM480 362.666667c0-17.066667 14.933333-32 32-32s29.866667 12.8 32 29.866666V640c0 17.066667-14.933333 32-32 32s-29.866667-12.8-32-29.866667V362.666667zM512 832c-23.466667 0-42.666667-19.2-42.666667-42.666667s19.2-42.666667 42.666667-42.666666 42.666667 19.2 42.666667 42.666666-19.2 42.666667-42.666667 42.666667z"  p-id="3442"></path>
</symbol>
<symbol class="icon" viewBox="0 0 1024 1024" id="iconTips" >
<path d="M288.085333 581.674667a298.666667 298.666667 0 1 1 447.829334 0l-44.373334 155.392a42.666667 42.666667 0 0 1-41.045333 30.933333H373.504a42.666667 42.666667 0 0 1-41.002667-30.933333l-44.373333-155.392zM682.666667 384a42.666667 42.666667 0 0 1-85.333334 0 85.333333 85.333333 0 0 0-85.333333-85.333333 42.666667 42.666667 0 0 1 0-85.333334 170.666667 170.666667 0 0 1 170.666667 170.666667z m-276.949334 298.666667h212.565334l40.874666-143.018667 12.8-14.506667a213.333333 213.333333 0 1 0-319.914666 0l12.8 14.506667L405.717333 682.666667zM597.333333 896a42.666667 42.666667 0 0 1-42.666666 42.666667h-85.333334a42.666667 42.666667 0 0 1-42.666666-42.666667H384a42.666667 42.666667 0 0 1-42.666667-42.666667v-25.6c0-9.386667 7.68-17.066667 17.066667-17.066666h307.2c9.386667 0 17.066667 7.68 17.066667 17.066666v25.6a42.666667 42.666667 0 0 1-42.666667 42.666667h-42.666667z"  p-id="5657"></path>
</symbol>
`)
