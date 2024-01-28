const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';

export const buildWsChennel =(channel,id)=>{
  const socket = new WebSocket(`${protocol}//${window.location.host}/ws/broadcast?channel=sac`);
  const socket1 = new WebSocket(`${protocol}//${window.location.host}/ws/broadcast?channel=sac`);

  const sendMessage=(massage)=>{
    socket.send(JSON.stringify({
      id:id,
      requestID:Lute.NewNodeID(),
      message:massage,
      channel:channel
    }))
  }
  socket1.addEventListener(
    'message',(event)=>{
      console.log(event,event.data)
    }
  )
  
  return {
    broadcast:sendMessage,
  }
}
