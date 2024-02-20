export const buildWsChannel = (channel, id) => {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const socket = new WebSocket(`${protocol}://${window.location.host}/ws/broadcast?channel=${channel}`);
  let handlers = {};

  // 发送消息
  const sendMessage = (message) => {
    socket.send(JSON.stringify({
      id: id,
      requestID: Lute.NewNodeID(), // 假设Lute.NewNodeID() 生成唯一请求ID
      message: message,
      channel: channel
    }));
  };

  // 监听消息，不处理返回值
  const listen = (type, callback) => {
    if (!handlers[type]) {
      handlers[type] = [];
    }
    handlers[type].push(callback);
  };

  // 处理接收到的消息
  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data)
    console.log(data)
    let  method = ''
    if(data.message){
      method = data.message.method
      console.log(method)

    }
    if (handlers[method]) {
      console.log(handlers)
      handlers[method].forEach(handler => handler(data.message));
    }
  });

  // 调用远程过程
  const call = (method, params) => {
    sendMessage({ method, params });
  };

  // 调用并等待响应
  const invoke = (method, params,channel) => {
    return new Promise((resolve, reject) => {
      const requestID = Lute.NewNodeID();
      sendMessage({ method, params, requestID });

      listen(requestID, (response) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.result);
        }
      });
    });
  };

  // 注册处理函数，允许返回值
  const handler = (method, callback) => {
    listen(method, (data) => {
      const response = callback(data);
      if (response) {
        // 如果handler有返回值，则发送回响应
        sendMessage({ id: id, response, method });
      }
    });
  };

  return {
    broadcast: sendMessage,
    call,
    invoke,
    handler,
    listen
  };
}