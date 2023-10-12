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
