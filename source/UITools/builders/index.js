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
export function emitEvent(element, eventName, detail) {
    // 创建一个新的 CustomEvent 对象
    let event = new CustomEvent(eventName, { detail });

    // 使用 dispatchEvent 方法触发事件
    element.dispatchEvent(event);
}
export function  createElementWithTagname(tagName, classNames, innerHTML) {
    const element = document.createElement(tagName);
    element.classList.add(...classNames);
    element.innerHTML = innerHTML;
    return element;
}
