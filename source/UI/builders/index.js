import { pluginInstance as plugin } from "../../asyncModules";
plugin.eventbus.on('plugin-loaded',()=>{
    创建悬浮球()
})

const 创建悬浮球 = () => {
    // 创建一个新的div元素，这将是我们的悬浮球
    let 悬浮球 = document.createElement('div');

    // 设置悬浮球的样式
    悬浮球.style.position = 'fixed';  // 固定位置
    悬浮球.style.bottom = '20px';     // 距离底部20px
    悬浮球.style.right = '20px';      // 距离右边20px
    悬浮球.style.width = '50px';      // 宽度50px
    悬浮球.style.height = '50px';     // 高度50px
    悬浮球.style.borderRadius = '50%'; // 边框半径50%，使其成为一个圆形
    悬浮球.style.backgroundColor = 'red'; // 背景色红色

    // 将悬浮球添加到页面中
    document.body.appendChild(悬浮球);
};