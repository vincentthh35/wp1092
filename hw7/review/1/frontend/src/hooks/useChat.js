import { useState } from "react";
const useChat = () => {
    const [status, setStatus] = useState({}); // { type, msg }
    const sendMessage = (activeKey, msg, me, server, chatBoxes) => {
        var to;
        for (var i = 0; i < chatBoxes.length; i++) {
            if (chatBoxes[i].key === activeKey) {
                to = chatBoxes[i].friend;
                break;
            }
        }
        server.sendEvent({
            type: 'MESSAGE',
            data: { to: to, name: me, body: msg },
        });
        // server.onmessage = (m) => {
        //     console.log(m.data)
        //     onEvent(JSON.parse(m.data));
        // };
        // const onEvent = (e) => {
        //     const { type } = e;
        //     if (type === "MESSAGE"){
        //         console.log("here")
        //         var index;
        //         for (var i = 0; i < chatBoxes.length; i++) {
                    
        //         }
        //         chatBoxes[index].chatLog.push(e.data.messages)
        //     }
        // }
        // chatBoxes[index].chatLog.push(e.data.messages)
    
    }; // { key, msg }
    return { status, sendMessage };
};
export default useChat;