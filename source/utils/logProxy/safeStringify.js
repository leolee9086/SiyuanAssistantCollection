let _Buffer = class {}
if (globalThis.require) {
  _Buffer = Buffer;
}

function 处理循环引用(cache) {
  return (key, value) => {
    if (cache.has(value)) {
      // 移除循环引用
      return '[Circular]';
    }
    cache.add(value);
    return value;
  };
}

function 处理复杂数据类型(value, depth, arrayLimit) {
  if (Array.isArray(value)) {
    // 处理大型数组
    if (value.length > arrayLimit) {
      return `[Array (${value.length})] ${safeStringify(value.slice(0, arrayLimit), depth - 1)}...`;
    }
  } else if (Object.keys(value).length > arrayLimit) {
    // 处理大型对象
    const limitedObj = {};
    Object.keys(value).slice(0, arrayLimit).forEach(key => {
      limitedObj[key] = value[key];
    });
    return `[Object (${Object.keys(value).length})] ${safeStringify(limitedObj, depth - 1)}...`;
  } else if (value instanceof Error) {
    // 处理 Error 对象
    return value.toString();
  } else if (value instanceof Date) {
    // 将 Date 对象转换为字符串
    return value.toISOString();
  } else if (window.require && value instanceof _Buffer) {
    // 将 Buffer 转换为字符串
    return value.toString();
  }
  return value;
}

export function 去循环序列化(obj, depth = 5, arrayLimit = 50) {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (depth <= 0) {
      return '[Max Depth Reached]';
    }
    if (typeof value === 'object' && value !== null) {
      value = 处理循环引用(cache)(key, value);
      depth--;
    }
    return value;
  });
}
export function 是否循环引用(obj) {
  const cache = new Set();
  try {
    JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          throw new Error('Detected a cycle');
        }
        cache.add(value);
      }
      return value;
    });
    return false; // 如果没有循环引用，返回false
  } catch (error) {
    return true; // 如果检测到循环引用，返回true
  }
}