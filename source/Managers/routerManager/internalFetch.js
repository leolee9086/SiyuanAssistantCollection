import delegate from '../../../static/delegates.js'
import url from '../../../static/url.js';

export const internalFetch = async (path, options = {}, router,user) => {
  // 创建上下文对象
  const ctx = createMocCtx(path, options)
  ctx.path = path;
  ctx.method = options.method || 'GET';
  ctx.headers = options.headers || {};
  ctx.request.body = options.body;
  ctx.status = 200;
  ctx.state.user=user
  // 创建一个 Promise，当 signal 的 abort 事件被触发时，这个 Promise 会被拒绝
  const abortPromise = new Promise((resolve, reject) => {
    if (options.signal) {
      options.signal.addEventListener('abort', () => {
        reject(new Error('Aborted'));
      });
    }
  });
  // 查找本地函数
  const fetchPromise = router.routes('/')(ctx, (ctx, next) => {
    console.log(ctx)
    return new Promise((resolve, reject) => {
      try {
        if (ctx&&ctx.status !== 404) { // 如果路由存在
          resolve(ctx);
        } else { // 如果路由不存在
          reject(new Error('404 not found'));
        }
      } catch (e) {
        reject(new Error('503 server Error'+e));
      }
    });
  });
  // 等待 fetchPromise 完成或 abortPromise 被拒绝
  const result = await Promise.race([fetchPromise, abortPromise]);
  // 如果没有找到匹配的路由，设置状态为404
  if (!result) {
    ctx.status = 404;
  }
  // 如果ctx.path被修改，那么执行新的本地函数
  if (ctx.path !== path) {
    return await internalFetch(ctx.path, options, router);
  }
  // 返回上下文的状态
  return ctx;
};
export const buildInternalFetch = (router,user) => {
  return async (path, options) => {
    return internalFetch(path, options, router,user)
  }
}


export const createMocCtx = (path, options = {}) => {
  const parsedUrl = url.parse(path, true);

  // 创建一个模拟的请求对象
  const mockRequest = {
    body: options.body || null,
    params: {}, // 这通常是路由参数，需要根据你的路由设置来填充
    query: parsedUrl.query,
    acceptsLanguages: () => { }, // 这些函数通常用于处理请求头，你需要根据实际需求来实现
    acceptsEncodings: () => { },
    acceptsCharsets: () => { },
    accepts: () => { },
    get: (field) => options.headers[field.toLowerCase()] || null,
    is: () => { }, // 这个函数通常用于检查请求体的类型，你需要根据实际需求来实现
    querystring: parsedUrl.query,
    idempotent: true,
    socket: {}, // 这个对象通常包含关于 TCP 连接的信息，你可能不需要在模拟请求中实现它
    search: parsedUrl.search,
    method: options.method || 'GET',
    path: parsedUrl.pathname,
    url: path,
    accept: {}, // 这个对象通常用于处理 Accept 请求头，你需要根据实际需求来实现
    origin: '', // 这些属性通常从请求头或 TCP 连接中获取，你可能不需要在模拟请求中实现它们
    href: '',
    subdomains: [],
    protocol: '',
    host: '',
    hostname: '',
    URL: '',
    header: options.headers || {},
    headers: options.headers || {},
    secure: false,
    stale: false,
    fresh: true,
    ips: [],
    ip: ''
  };  // 创建一个模拟的响应对象
  const mockResponse = {
    body: {},
    attachment: () => { },
    redirect: () => { },
    remove: () => { },
    vary: () => { },
    has: () => { },
    set: () => { },
    append: () => { },
    flushHeaders: () => { },
    status: 200,
    message: '',
    length: 0,
    type: '',
    lastModified: '',
    etag: '',
    headerSent: false,
    writable: true
  };

  // 创建一个模拟的上下文对象
  const mockCtx = {
    path: null,
    method: 'GET',
    headers: {},
    status: 200,
    request: mockRequest,
    response: mockResponse,
    state: {},
    get req() { return this.request },
    get res() { return this.response }
  };

  // 使用 delegate 库来代理请求和响应对象的方法和属性
  delegate(mockCtx, 'response')
    .method('attachment')
    .method('redirect')
    .method('remove')
    .method('vary')
    .method('has')
    .method('set')
    .method('append')
    .method('flushHeaders')
    .access('status')
    .access('message')
    .access('body')
    .access('length')
    .access('type')
    .access('lastModified')
    .access('etag')
    .getter('headerSent')
    .getter('writable');

  delegate(mockCtx, 'request')
    .method('acceptsLanguages')
    .method('acceptsEncodings')
    .method('acceptsCharsets')
    .method('accepts')
    .method('get')
    .method('is')
    .access('querystring')
    .access('idempotent')
    .access('socket')
    .access('search')
    .access('method')
    .access('query')
    .access('path')
    .access('url')
    .access('accept')
    .getter('origin')
    .getter('href')
    .getter('subdomains')
    .getter('protocol')
    .getter('host')
    .getter('hostname')
    .getter('URL')
    .access('header')
    .access('headers')
    .getter('secure')
    .getter('stale')
    .getter('fresh')
    .getter('ips')
    .getter('ip');

  return mockCtx;
}