let _Buffer = class{}
if(window.require){
  _Buffer=Buffer
}
export function safeStringify(obj, depth = 5, arrayLimit = 50) {
  const cache = new Set();
  return JSON.stringify(obj, (key, value) => {
    if (depth <= 0) {
      return '[Max Depth Reached]';
    }
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        // 移除循环引用
        return '[Circular]';
      }
      cache.add(value);
      if (Array.isArray(value)) {
        // 处理大型数组
        if (value.length > arrayLimit) {
          return `[Array (${value.length})] ${safeStringify(value.slice(0, arrayLimit))}...`;
        }
      } else if (Object.keys(value).length > arrayLimit) {
        // 处理大型对象
        const limitedObj = {};
        Object.keys(value).slice(0, arrayLimit).forEach(key => {
          limitedObj[key] = value[key];
        });
        return `[Object (${Object.keys(value).length})] ${safeStringify(limitedObj)}...`;
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
      depth--;
    }
    return value;
  });
}
