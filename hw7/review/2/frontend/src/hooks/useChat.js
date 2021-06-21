import { useState } from "react";
const useChat = () => {
    const [status, setStatus] = useState({}); // { type, msg }
    const sendMessage = (server, payload) => {
        /*server.onmessage = (m) => {
            onEvent(JSON.parse(m.data));
        };  */
        console.log(payload);
        const {me, key, body} = payload;
        const key_split = key.split('_');
        const friend = (me === key_split[0]) ? key_split[1] : key_split[0];
        server.sendEvent({
            type: 'MESSAGE',
            data: { to: friend, name: me, body: body },
        });
    }; // { key, msg }
    return { status, sendMessage };
};
export default useChat;