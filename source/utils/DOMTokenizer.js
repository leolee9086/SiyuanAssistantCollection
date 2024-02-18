export const 创建token对象 = (所在元素, 分词结果) => {
    let { start, end, word } = 分词结果
    let token = { start, end, word }
    token.block = 所在元素.getAttribute('data-node-id')
    token.id =Lute.NewNodeID()
    const range = 从文字位置创建range(所在元素, token.start, token.end);
    if (range && range.startContainer) {
        const startNode = range.startContainer.nodeType === Node.TEXT_NODE ? range.startContainer.parentNode : range.startContainer;
        token.xpathWithinBlock = generateXPathForElement(startNode, 所在元素);
    }else{
        throw '编辑器token生成失败'
    }
    return token
}
function generateXPathForElement(element, relativeToElement) {
    if (element === relativeToElement) return ".";
    const siblings = Array.from(element.parentNode.childNodes);
    const elementIndex = siblings.indexOf(element) + 1;
    return generateXPathForElement(element.parentNode, relativeToElement) + "/" + element.tagName.toLowerCase() + "[" + elementIndex + "]";
}
export const 从文字位置创建range = (node, start, end) => {
    const range = document.createRange();
    let currentNode = node;
    let currentOffset = 0;
    let foundStart = false;
    let foundEnd = false;
    function traverse(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const nodeLength = node.textContent.length;
            const nodeStart = currentOffset;
            const nodeEnd = currentOffset + nodeLength;

            if (!foundStart && start >= nodeStart && start <= nodeEnd) {
                range.setStart(node, start - nodeStart);
                foundStart = true;
            }

            if (!foundEnd && end >= nodeStart && end <= nodeEnd) {
                range.setEnd(node, end - nodeStart);
                foundEnd = true;
            }

            currentOffset += nodeLength;
        } else {
            const childNodes = Array.from(node.childNodes);
            childNodes.forEach(childNode => {
                traverse(childNode);
            });
        }
    }
    traverse(currentNode);
    return range;
}
const getRangeFromToken = (token) => {
    let 所在元素 = document.querySelector(`.protyle-wysiwyg.protyle-wysiwyg--attr [data-node-id="${token.block}"]`)
    if (所在元素) {
        return 从文字位置创建range(所在元素, token.start, token.end)
    }
}
export const selectToken = (token, 所在元素) => {
    const range = getRangeFromToken(token, 所在元素);
    if (range) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
};
export const highlightToken = (token, 所在元素) => {
    const range = getRangeFromToken(token, 所在元素);
    if(!range){
        return
    }
    const rects = getLineRects(range);
    const highlightElements = [];
    rects.forEach((rect) => {
        const highlightElement = document.createElement('div');
        window.document.body.appendChild(highlightElement);
        highlightElement.classList.add('highlight');
        highlightElement.style.position = 'fixed';
        highlightElement.style.top = rect.top + 'px';
        highlightElement.style.left = rect.left + 'px';
        highlightElement.style.width = rect.width + 'px';
        highlightElement.style.height = rect.height + 'px';
        highlightElements.push(highlightElement);
        setTimeout(() => { highlightElement.remove(); }, 1000);
    });
    return highlightElements; // 返回高亮元素数组以便之后可能的操作
};

export const dehighlightToken = (highlightElements) => {
    highlightElements.forEach(highlightElement => {
        highlightElement && highlightElement.remove();
    });
};

export const deleteTokenContents = (token, 所在元素) => {
    const range = getRangeFromToken(token, 所在元素);
    range.deleteContents();
    let event = new Event('input');
    // 假设token对象有protyle属性，需要根据实际情况调整
    if (token.protyle) { token.protyle.protyle.wysiwyg.element.dispatchEvent(event); }
};
export const replaceTokenContents = (token, 所在元素, newContent) => {
    const range = getRangeFromToken(token, 所在元素);
    range.deleteContents(); // 删除原有内容
    const newNode = document.createTextNode(newContent); // 创建新内容的文本节点
    range.insertNode(newNode); // 将新内容插入到原位置
    let event = new Event('input');
    // 假设token对象有protyle属性，需要根据实际情况调整
    if (token.protyle) { token.protyle.protyle.wysiwyg.element.dispatchEvent(event); }
};
export const getLineRects = (range) => {
    const charRects = [];
    const startLineRange = range.cloneRange();
    startLineRange.collapse(true);
    const endLineRange = range.cloneRange();
    endLineRange.collapse(false);
    const startContainer = startLineRange.startContainer;
    const startOffset = startLineRange.startOffset;
    const endContainer = endLineRange.endContainer;
    const endOffset = endLineRange.endOffset;
    // Get the range of each character
    let currentNode = startContainer;
    let currentOffset = startOffset;
    while (currentNode && currentOffset <= endOffset) {
        if (currentNode.nodeType === Node.TEXT_NODE) {
            const nodeLength = currentNode.textContent.length;
            const endIndex = Math.min(endOffset, nodeLength); // 修正偏移量超过节点长度的问题
            for (let i = currentOffset; i < endIndex; i++) {
                const charRange = document.createRange();
                charRange.setStart(currentNode, i);
                charRange.setEnd(currentNode, i + 1);
                const rects = Array.from(charRange.getClientRects());
                if (rects.length > 0) {
                    charRects.push(...rects);
                }
            }
            currentOffset = endIndex;
        }
        currentNode = currentNode.nextSibling;
    }
    return charRects;
}
