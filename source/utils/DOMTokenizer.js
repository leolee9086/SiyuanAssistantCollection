export const 创建token对象 = (所在元素, 分词结果) => {
    let { start, end, word } = 分词结果
    let token = { start, end, word }
    token.getRange =()=>{return 从文字位置创建range(所在元素, token.start, token.end)}
    token.select = function () {
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(token.range);
    }
    token.highlight = function () {
        const rects = getLineRects(token.range);
        token.highlightElements = []
        rects.forEach(
            (rect) => {
                const highlightElement = document.createElement('div');
                window.document.body.appendChild(highlightElement);
                highlightElement.classList.add('highlight');
                highlightElement.style.position = 'fixed';
                highlightElement.style.top = rect.top + 'px';
                highlightElement.style.left = rect.left + 'px';
                highlightElement.style.width = rect.width + 'px';
                highlightElement.style.height = rect.height + 'px';
                token.highlightElements.push(highlightElement)
                setTimeout(() => { highlightElement.remove() }, 1000)
            }
        )
        //一秒钟之后高亮用的元素消失
    }
    token.dehighlight = function () {
        token.highlightElements && token.highlightElements.forEach(
            highlightElement => { highlightElement && highlightElement.remove() }
        )
    }
    token.delete = () => {
        token.range.deleteContents()
        let event = new Event('input')
        if (token.protyle) { token.protyle.protyle.wysiwyg.element.dispatchEvent(event) }

    }
    return token
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
