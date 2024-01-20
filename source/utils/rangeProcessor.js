import { hasClosestBlock } from "./DOMFinder.js";
export function findTokenElement(current, range) {
  if (current.nodeType === 1 && current.classList.contains("token")) {
    return current;
  }
  if (current.childNodes.length > 0) {
    for (let i = 0; i < current.childNodes.length; i++) {
      const child = current.childNodes[i];
      const tokenElement = findTokenElement(child, range);
      if (tokenElement) {
        return tokenElement;
      }
    }
  }
  if (range.startContainer === current || range.endContainer === current) {
    return current.parentElement;
  }
  return null;
}

export function 获取光标所在位置() {
    let 空位置 = { pos: null, element: null };
    // 获取选区对象
    const selection = window.getSelection();
    if (!selection) return 空位置;
    // 获取选区范围
    let range;
    try {
        range = selection.getRangeAt(0);
        if (!range) return 空位置;
    } catch (e) {
        return 空位置;
    }
    // 找到离范围最近的可编辑祖先元素
    let current = range.commonAncestorContainer;
    while (current !== document) {
        if (current.nodeType === 1 && current.getAttribute("contenteditable")) {
            break;
        }
        current = current.parentNode;
    }
    // 限制范围在可编辑祖先内
    const limitedRange = 获取元素内文字选区偏移(current);
    const tokenElement = findTokenElement(current, range);
    return {
        pos: limitedRange,
        editableElement: current,
        blockElement: hasClosestBlock(current),
        parentElement: tokenElement,
        range: range
    };
}
export function getEditorRange(nodeElement) {
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    // 确保选区范围在指定的节点元素内
    if (nodeElement.contains(range.startContainer) && nodeElement.contains(range.endContainer)) {
      return range;
    }
  }
  // 如果没有选区或选区不在节点元素内，则创建一个新的范围
  const range = document.createRange();
  range.selectNodeContents(nodeElement);
  range.collapse(true); // 折叠范围到起始位置，即光标位置
  return range;
}
export function 获取选区屏幕坐标(nodeElement, range) {
    if (!range) {
      range = getEditorRange(nodeElement);
    }
    if (!nodeElement.contains(range.startContainer)) {
      return {
        left: 0,
        top: 0,
      };
    }
    let cursorRect;
    if (range.getClientRects().length === 0) {
      if (range.startContainer.nodeType === 3) {
        // 空行时，会出现没有 br 的情况，需要根据父元素 <p> 获取位置信息
        const parent = range.startContainer.parentElement;
        if (parent && parent.getClientRects().length > 0) {
          cursorRect = parent.getClientRects()[0];
        } else {
          return {
            left: 0,
            top: 0,
          };
        }
      } else {
        const children = range.startContainer.children;
        if (
          children[range.startOffset] &&
          children[range.startOffset].getClientRects().length > 0
        ) {
          // markdown 模式回车
          cursorRect = children[range.startOffset].getClientRects()[0];
        } else if (range.startContainer.childNodes.length > 0) {
          // in table or code block
          const cloneRange = range.cloneRange();
          range.selectNode(
            range.startContainer.childNodes[Math.max(0, range.startOffset - 1)]
          );
          cursorRect = range.getClientRects()[0];
          range.setEnd(cloneRange.endContainer, cloneRange.endOffset);
          range.setStart(cloneRange.startContainer, cloneRange.startOffset);
        } else {
          cursorRect = range.startContainer.getClientRects()[0];
        }
        if (!cursorRect) {
          let parentElement = range.startContainer.childNodes[range.startOffset];
          if (!parentElement) {
            parentElement =
              range.startContainer.childNodes[range.startOffset - 1];
          }
          if (!parentElement) {
            cursorRect = range.getBoundingClientRect();
          } else {
            while (
              !parentElement.getClientRects ||
              (parentElement.getClientRects &&
                parentElement.getClientRects().length === 0)
            ) {
              parentElement = parentElement.parentElement;
            }
            cursorRect = parentElement.getClientRects()[0];
          }
        }
      }
    } else {
      const rects = range.getClientRects(); // 由于长度过长折行，光标在行首时有多个 rects https://github.com/siyuan-note/siyuan/issues/6156
      return {
        // 选中多行不应遮挡第一行 https://github.com/siyuan-note/siyuan/issues/7541
        left: rects[rects.length - 1].left,
        top: rects[0].top,
      };
    }
    return {
      left: cursorRect.left,
      top: cursorRect.top,
    };
  }

// 辅助方法,限制范围在指定元素内
export function 获取元素内文字选区偏移(element) {
  let caretOffset = 0;
  const doc = element.ownerDocument || element.document;
  const win = doc.defaultView || doc.parentWindow;
  let sel;
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      const range = win.getSelection().getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
  } else if ((sel = doc.selection) && sel.type != "Control") {
    const textRange = sel.createRange();
    const preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
}
export function 获取当前光标所在分词结果(分词结果数组, pos) {
    let 当前光标所在分词结果数组 = 分词结果数组.filter(token => {
        return (token.start <= pos && token.end >= pos) && (token.word && token.word.trim().length >= 1);
    }).sort((a, b) => {
        return b.word.length - a.word.length;
    });

    return 当前光标所在分词结果数组[0] || null;
}
