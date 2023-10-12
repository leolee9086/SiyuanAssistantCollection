

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
    return 悬浮球
};
export function string2DOM(string) {
    string = string?string.trim():""
    let div = document.createElement('div');
    div.innerHTML = string;

    // 如果 div 只有一个子元素，直接返回这个子元素
    if (div.childNodes.length === 1) {
        return div.firstChild;
    }
    // 否则，返回包含所有子元素的文档片段
    let fragment = document.createDocumentFragment();
    while (div.firstChild) {
        fragment.appendChild(div.firstChild);
    }
    return fragment;
}
