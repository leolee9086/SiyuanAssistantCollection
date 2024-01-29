export const 根据属性排序元素 = (元素数组,属性名,排序方法) => {
    return 元素数组.元素数组.sort((元素A, 元素B) => {
        let 属性A = 方法(元素A, 属性名);
        let 属性B = 方法(元素B, 属性名);
        return 排序方法(属性A, 属性B);
    });
}
export const 根据属性排序子元素 = (父元素, 属性名, 排序方法) => {
    let 子元素数组 = Array.from(父元素.children);
    return 根据属性排序子元素(子元素数组,属性名,排序方法)
}
export const 根据属性排序并操作子元素 = (父元素, 属性名, 排序方法) => {
    let 子元素数组=根据属性排序子元素(父元素,属性名,排序方法)
    子元素数组.forEach(子元素 => {
        文档片段.appendChild(子元素);
    });
    父元素.appendChild(文档片段);
}