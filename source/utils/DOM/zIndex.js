export const 计算zindex=(selectorOrElements)=>{
    let elements;
    if (typeof selectorOrElements === 'string') {
        elements = document.querySelectorAll(selectorOrElements);
    } else if (selectorOrElements instanceof NodeList || Array.isArray(selectorOrElements)) {
        elements = selectorOrElements;
    } else {
        throw new Error('Invalid argument. It should be a selector string or a NodeList/Array of elements.');
    }

    let maxZIndex = 0;
    elements.forEach(element => {
        const zIndex = parseInt(window.getComputedStyle(element).zIndex, 10);
        if (!isNaN(zIndex)) {
            maxZIndex = Math.max(maxZIndex, zIndex);
        }
    });

    return maxZIndex + 1;
}