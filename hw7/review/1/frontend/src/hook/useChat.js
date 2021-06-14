import { useState } from "react";
const useChat = (me, SendMessage) => {
  const [status, setStatus] = useState({}); // { type, msg }
  const sendMessage = (payload) => {
    let users = payload.key.split("_");
    SendMessage(payload.body, me, me === users[1] ? users[0] : users[1]);
  };
  return { status, setStatus, sendMessage };
};
export default useChat;
