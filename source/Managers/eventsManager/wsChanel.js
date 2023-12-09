import logger from "../logger/index.js";
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const socket = new WebSocket(`${protocol}//${window.location.host}/ws/broadcast?channel=test`);
const socket1 = new WebSocket(`${protocol}//${window.location.host}/ws/broadcast?channel=test`);

// 发送消息
logger.wslog(socket)
addAutoReconnect(socket)
function sendMessage(message) {
  socket.send(message);
}

// 接收消息
socket1.addEventListener('message', event => {
  const message = event.data;
  // 在这里显示消息，例如将消息添加到一个聊天框
  logger.wslog(message);
});
// 每秒发送一个时钟消息
setInterval(() => {
  try {
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      sendMessage(timeString);
  } catch (error) {
      socket.close();
  }
}, 1000);


  function addAutoReconnect(socket, initialDelay = 100) {
    let delay = initialDelay;
    socket.addEventListener('close', function handleSocketClose() {
      setTimeout(() => {
        console.log(`Attempting to reconnect with delay: ${delay}ms`);
        const newSocket = new WebSocket(socket.url);
        newSocket.addEventListener('open', function handleSocketOpen() {
          console.log('Reconnected successfully');
          // Remove the event listener to prevent memory leaks
          newSocket.removeEventListener('open', handleSocketOpen);
          // Reset the delay
          delay = initialDelay;
          // Add auto reconnect to the new socket
          addAutoReconnect(newSocket, initialDelay);
        });
        newSocket.addEventListener('close', handleSocketClose);
      }, delay);
      // Increase the delay exponentially
      delay *= 2;
    });
  }