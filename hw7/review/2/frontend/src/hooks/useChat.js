import { useState } from "react";

const useChat = () => {
    const [status, setStatus] = useState({}); // { type, msg }
    const sendMessage = (payload, socket) => {
        socket.current.sendEvent({
            type: 'MESSAGE',
            data: payload
        })
    }; // { key, msg }
    return { status, sendMessage };
};

export default useChat;
