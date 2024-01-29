import { 校验并转化为数组 } from "../Array/toArray.js";
export function 添加并延时移除类名(元素, 类名, 延时 = 500) {
    元素.classList.add(类名); // 添加类名
    setTimeout(() => {
        元素.classList.remove(类名); // 延时后移除类名
    }, 延时);
}
export function 添加并延时移除类名数组(元素数组, 类名, 延时 = 500) {
    元素数组 = 校验并转化为数组(元素数组);
    元素数组.forEach(元素 => {
        元素.classList.add(类名); // 添加类名
        setTimeout(() => {
            元素.classList.remove(类名); // 延时后移除类名
        }, 延时);
    });
}