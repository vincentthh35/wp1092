import { useState } from "react"; 
const server = new WebSocket('ws://localhost:8080')
const useChat = () => {
  const [messages, setMessages] = useState('')
  server.sendEvent = (e) => server.send(JSON.stringify(e));
  server.onmessage = (byteString) => {
    const { data } = byteString;
    const {"type": task, "data": payload} = JSON.parse(data);
    switch (task){
      case 'CHAT':
        setMessages(payload.messages)
        break
      case 'MESSAGE':
        setMessages([...messages, payload.message])
        break
      default:
        break
    }
  }
  const startChat = async (from, to) => {
    server.sendEvent({
      type: 'CHAT',
      data: { to: to, name: from },
    });
  };

  const sendMessage = ({name, key, body}) => {
    let split = key.split('_')
    let to = split.filter(n => n !== name)[0]
    if (to === undefined) to = name
    server.sendEvent({
      type: 'MESSAGE',
      data: { to: to, name: name, body:body },
    });
  }; // { key, msg }
  return {
    messages,
    sendMessage,
    startChat
 };
};
export default useChat;
