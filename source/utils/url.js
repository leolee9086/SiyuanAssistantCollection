export function  正规化URL(原始URL) {
    // 创建一个URL对象
    let url = new URL(原始URL, location.href);
    // 返回正规化的URL，并替换连续的//
    return url.href.replace(/([^:])\/\/+/g, '$1/');
  }