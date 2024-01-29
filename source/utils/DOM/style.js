import { 校验并转化为数组 } from "../Array/toArray.js";
export function 高亮块元素(块id数组) {
    块id数组 = 校验并转化为数组(块id数组);
    let 目标元素数组 = [];
    块id数组.forEach(
        块id => {
            let 块元素数组 = document.querySelectorAll(`.protyle-wysiwyg.protyle-wysiwyg--attr [data-node-id="${块id}"]`);
            目标元素数组 = 目标元素数组.concat(Array.from(块元素数组));
        }
    );
    目标元素数组.forEach(element => {
        element.classList.add("highlight"); // 添加高亮样式
        setTimeout(() => {
            element.classList.remove("highlight"); // 移除高亮样式
        }, 500);
    });
}
export function 高亮选择器元素(选择器) {
    let 目标元素数组 = Array.from(document.querySelectorAll(选择器));
    目标元素数组.forEach(element => {
        element.classList.add("highlight"); // 添加高亮样式
        setTimeout(() => {
            element.classList.remove("highlight"); // 移除高亮样式
        }, 500);
    });
}
export function 高亮选择器数组元素(选择器数组){
    选择器数组 = 校验并转化为数组(选择器数组);
    选择器数组.forEach(选择器 => {
        高亮选择器元素(选择器)
    });
}