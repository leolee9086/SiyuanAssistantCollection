function serializeRange(range) {
    function getXPathForElement(element) {
        const idx = $(element.parentNode).children(element.tagName).index(element) + 1;
        return `${getXPathForElement(element.parentNode)}/${element.tagName}[${idx}]`;
    }

    const startContainerXPath = getXPathForElement(range.startContainer);
    const endContainerXPath = getXPathForElement(range.endContainer);

    const rangeInfo = {
        startContainerXPath,
        startOffset: range.startOffset,
        endContainerXPath,
        endOffset: range.endOffset
    };

    return JSON.stringify(rangeInfo);
}
function deserializeRange(rangeInfoStr) {
    const rangeInfo = JSON.parse(rangeInfoStr);

    function getElementByXPath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    const range = document.createRange();
    const startContainer = getElementByXPath(rangeInfo.startContainerXPath);
    const endContainer = getElementByXPath(rangeInfo.endContainerXPath);

    range.setStart(startContainer, rangeInfo.startOffset);
    range.setEnd(endContainer, rangeInfo.endOffset);

    return range;
}