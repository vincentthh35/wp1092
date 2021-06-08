import { useState, useEffect, useRef } from 'react';

const useChat = ({ me, displayStatus, createChatBox, setReceivedMessage }) => {
    const client = useRef(null);

    const createSocket = (name) => {
        const client = new WebSocket('ws://localhost:8080');
        // client.onmessage = (bytestring) => {
        //     const { data } = bytestring;
        //     const payload = JSON.parse(data);
        //     switch (payload.type) {
        //         case 'CHAT':
        //             console.log(payload.data.messages);
        //             createChatBox(name, payload.data.messages);
        //             // setMessages(() => [...messages, ...payload.data.messages]);
        //             break;
        //         case 'MESSAGE':
        //             console.log(payload.data.message);
        //             // must append the message to active chatroom
        //             // handleMessage(payload.data.message);
        //             setReceivedMessage(payload.data.message);
        //             break;
        //         default:
        //             break;
        //     }
        // };
        // client.onopen = () => {
        //     sendData(client, {
        //         type: 'CHAT',
        //         data: {
        //             name: me,
        //             to: name,
        //             body: '', // ?
        //         },
        //     });
        // };
        return client;
    };

    const sendData = async (data) => {
        if (client.current.readyState !== 1) {
            return;
        }
        await client.current.send(JSON.stringify(data));
        return client.current.readyState;
    };

    const sendMessage = async (payload) => {
        if (!payload.type || !payload.data) {
            console.log('incorrect payload:');
            console.log(payload);
            return;
        }
        console.log('sendmessage:');
        console.log(payload);
        let ret;
        switch (payload.type) {
            case 'INIT':
            case 'CLOSE':
            case 'MESSAGE':
            case 'CHAT':
                ret = await sendData(payload);
                return (ret === 1) ? 0 : -1;
            default:
                console.log('incorrect payload:');
                console.log(payload);
                return -1;
        }
    };

    useEffect(() => {
        client.current = new WebSocket('ws://localhost:8080');
        client.current.onerror = (e) => {
            console.error(e);
            displayStatus({
                type: 'error',
                msg: 'WebSocket error, please check log for more detail (server is possibly down)'
            });
        };
        client.current.onmessage = (bytestring) => {
            const { data } = bytestring;
            const payload = JSON.parse(data);
            payload.data.type = payload.type;
            switch (payload.type) {
                case 'INIT':
                case 'CHAT':
                case 'MESSAGE':
                    setReceivedMessage(payload.data);
                    break;
                default:
                    break;
            }
        };
        client.current.onopen = async () => {
            console.log('connection');
            const ret = await sendMessage({
                type: 'INIT',
                data: {
                    name: me,
                },
            });
            if (ret === 0) displayStatus({ type: 'success', msg: 'Successfully recover chat box history' });
            else displayStatus({ type: 'error', msg: 'Error when sending chat box recover message' });
        };
        return () => client.current.close();
    }, []);

    return { sendMessage };
};

export default useChat;
