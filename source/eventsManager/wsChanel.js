import logger from "../logger/index.js";
const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const socket = new WebSocket(`${protocol}//${window.location.host}/ws/broadcast?channel=test`);
const socket1 = new WebSocket(`${protocol}//${window.location.host}/ws/broadcast?channel=test`);

// 发送消息
logger.wslog(socket)
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
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    sendMessage(timeString);
  }, 1000);