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