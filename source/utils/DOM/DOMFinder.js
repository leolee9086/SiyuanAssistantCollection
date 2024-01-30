
//下面这些都是从思源里面拿过来的工具方法
export const hasClosestByClassName = (element, className, top = false) => {
    if (!element) {
      return false;
    }
    if (element.nodeType === 3) {
      element = element.parentElement;
    }
    let e = element;
    let isClosest = false;
    while (
      e &&
      !isClosest &&
      (top ? e.tagName !== "BODY" : !e.classList.contains("protyle-wysiwyg"))
    ) {
      if (e.classList?.contains(className)) {
        isClosest = true;
      } else {
        e = e.parentElement;
      }
    }
    return isClosest && e;
  };
export  const hasTopClosestByClassName = (element, className, top = false) => {
    let closest = hasClosestByClassName(element, className, top);
    let parentClosest = false;
    let findTop = false;
    while (
      closest &&
      (top
        ? closest.tagName !== "BODY"
        : !closest.classList.contains("protyle-wysiwyg")) &&
      !findTop
    ) {
      parentClosest = hasClosestByClassName(
        closest.parentElement,
        className,
        top
      );
      if (parentClosest) {
        closest = parentClosest;
      } else {
        findTop = true;
      }
    }
    return closest || false;
};

export const hasTopClosestByTag = (element, nodeName) => {
    let closest = hasClosestByTag(element, nodeName);
    let parentClosest = false;
    let findTop = false;
    while (
      closest &&
      !closest.classList.contains("protyle-wysiwyg") &&
      !findTop
    ) {
      parentClosest = hasClosestByTag(closest.parentElement, nodeName);
      if (parentClosest) {
        closest = parentClosest;
      } else {
        findTop = true;
      }
    }
    return closest || false;
  };
  
export const hasTopClosestByAttribute = (element, attr, value, top = false) => {
    let closest = hasClosestByAttribute(element, attr, value, top);
    let parentClosest = false;
    let findTop = false;
    while (
      closest &&
      !closest.classList.contains("protyle-wysiwyg") &&
      !findTop
    ) {
      parentClosest = hasClosestByAttribute(
        closest.parentElement,
        attr,
        value,
        top
      );
      if (parentClosest) {
        closest = parentClosest;
      } else {
        findTop = true;
      }
    }
    return closest || false;
  };
  
export const hasClosestByAttribute = (element, attr, value, top = false) => {
    if (!element) {
      return false;
    }
    if (element.nodeType === 3) {
      element = element.parentElement;
    }
    let e = element;
    let isClosest = false;
    while (
      e &&
      !isClosest &&
      (top ? e.tagName !== "BODY" : !e.classList.contains("protyle-wysiwyg"))
    ) {
      if (
        typeof value === "string" &&
        e.getAttribute(attr)?.split(" ").includes(value)
      ) {
        isClosest = true;
      } else if (typeof value !== "string" && e.hasAttribute(attr)) {
        isClosest = true;
      } else {
        e = e.parentElement;
      }
    }
    return isClosest && e;
  };
  
export  const hasClosestBlock = (element) => {
    const nodeElement = hasClosestByAttribute(element, "data-node-id", null);
    if (
      nodeElement &&
      nodeElement.tagName !== "BUTTON" &&
      nodeElement.getAttribute("data-type")?.startsWith("Node")
    ) {
      return nodeElement;
    }
    return false;
  };
  
export  const hasClosestByMatchTag = (element, nodeName) => {
    if (!element) {
      return false;
    }
    if (element.nodeType === 3) {
      element = element.parentElement;
    }
    let e = element;
    let isClosest = false;
    while (e && !isClosest && !e.classList.contains("protyle-wysiwyg")) {
      if (e.nodeName === nodeName) {
        isClosest = true;
      } else {
        e = e.parentElement;
      }
    }
    return isClosest && e;
  };
  
export  const hasClosestByTag = (element, nodeName) => {
    if (!element) {
      return false;
    }
    if (element.nodeType === 3) {
      element = element.parentElement;
    }
    let e = element;
    let isClosest = false;
    while (e && !isClosest && !e.classList.contains("b3-typography")) {
      if (e.nodeName.indexOf(nodeName) === 0) {
        isClosest = true;
      } else {
        e = e.parentElement;
      }
    }
    return isClosest && e;
  };
