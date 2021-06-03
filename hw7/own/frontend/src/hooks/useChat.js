import { useState, useEffect, useRef } from 'react';

const useChat = ({ me, displayStatus, createChatBox, setReceivedMessage, recoverHistory }) => {
    // const [messages, setMessages] = useState([]);
    const client = useRef(null);
    // const client = new WebSocket('ws://localhost:8080');

    // const handleMessage = (message) => {
    //     receiveMessage(message);
    // }

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

    useEffect(() => {
        client.current = new WebSocket('ws://localhost:8080');
        client.current.onmessage = (bytestring) => {
            const { data } = bytestring;
            const payload = JSON.parse(data);
            payload.data.type = payload.type;
            switch (payload.type) {
                case 'CHAT':
                    console.log(payload.data.messages);
                    // initChatBox(payload.data.messages);
                    // createChatBox(payload.data.name, payload.data.messages);
                    setReceivedMessage(payload.data);
                    // setMessages(() => [...messages, ...payload.data.messages]);
                    break;
                case 'MESSAGE':
                    console.log(payload.data.message);
                    // must append the message to active chatroom
                    // handleMessage(payload.data.message);
                    setReceivedMessage(payload.data);
                    break;
                default:
                    break;
            }
        };
        client.current.onopen = () => {
            recoverHistory();
        };
        return () => client.current.close();
    }, [])

    const sendData = async (data) => {
        if (client.current.readyState !== 1) {
            console.log('AAA');
            return;
        }
        await client.current.send(JSON.stringify(data));
        return client.current.readyState;
        // await client.current.send(JSON.stringify(data));
        // return client.current.readyState;
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
            case 'MESSAGE':
                ret = await sendData({
                    type: 'MESSAGE',
                    data: {
                        name: payload.data.name,
                        to: payload.data.to,
                        body: payload.data.body,
                    },
                });
                if (ret === 1) {

                }
                return (ret === 1) ? 0 : -1;
            case 'CHAT':
                ret = await sendData({
                    type: 'CHAT',
                    data: {
                        name: payload.data.name,
                        to: payload.data.to,
                        body: '', // ?
                    },
                });
                return (ret === 1) ? 0 : -1;
            default:
                console.log('incorrect payload:');
                console.log(payload);
                return -1;
        }
    };

    return { sendMessage, createSocket };
};

export default useChat;
