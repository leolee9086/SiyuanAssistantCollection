// 创建 DocumentFragment 并添加待添加数组中的元素，并支持中断操作
function 创建并添加元素到DocumentFragment(frag, signal) {
    console.log(待添加数组.length)
    let div = document.createElement('div');

    for (let index = 0; index < 20&&index<待添加数组.length; index++) {
        if (signal.aborted) {
            console.log(`Operation aborted at index ${index}`);
            break; // 使用 break 来确保完全退出循环
        }
        div.innerHTML=待添加数组[index].content
        frag.appendChild(div.firstChild);
    }
}
// 将选中的元素移动到 DocumentFragment 的顶部
function 移动选中元素到顶部(element, frag) {
    element.querySelectorAll(".b3-card__info").forEach(div => {
        let checkbox = div.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) {
            frag.prepend(div);
        }
    });
}

// 更新元素内容，并支持中断操作
function 更新元素内容(element, frag,) {
    if (signal.aborted) {
        console.log('Operation aborted before updating content');

        return;
    }
    element.querySelector('#SAC-TIPS').innerHTML = '';
    element.querySelector('#SAC-TIPS').appendChild(frag);
}
