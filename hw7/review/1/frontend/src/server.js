import { useState } from "react";
function UseServer() {
  const server = new WebSocket("ws://localhost:8080");
  server.onmessage = (m) => {
    onEvent(JSON.parse(m.data));
  };
  const [messages, setMessage] = useState([]);
  server.sendEvent = (e) => server.send(JSON.stringify(e));

  const startChat = (sender, accepter) => {
    if (!sender || !accepter) {
      throw new Error("Fill in the inputs");
    }

    server.sendEvent({
      type: "CHAT",
      data: { to: sender, name: accepter },
    });
  };

  const SendMessage = (msg, sender, accepter) => {
    if (!msg || !sender || !accepter) {
      throw new Error("Empty input!");
    }
    server.sendEvent({
      type: "MESSAGE",
      data: { to: accepter, name: sender, body: msg },
    });
  };

  const onEvent = (e) => {
    const { type } = e;

    switch (type) {
      case "CHAT": {
        setMessage(e.data.messages);
        break;
      }
      case "MESSAGE": {
        setMessage((messages) => [...messages, e.data.message]);
        break;
      }
      default:
        break;
    }
  };
  return { messages, startChat, SendMessage };
}

export default UseServer;
