import { message } from 'antd';
import {useState} from 'react';

const client = new WebSocket('ws://localhost:8080')
const useChatBox = () => {
    const [chatBoxes, setChatBoxes] = useState([]);
    const [status, setStatus] = useState({});
    const createChatBox = (friend, me) => {
        const newKey = me <= friend ? (me+'_'+friend): (friend+'_'+me)
        if (chatBoxes.some(({key}) => key === newKey)){
            throw new Error(friend+"'s chat box has already opened")
        }
        sendMessage('CHAT', {name: me, to: friend})
        return newKey
    }
    const removeChatBox = (targetKey, activeKey) => {
        let newActiveKey = activeKey;
        let lastIndex;
        chatBoxes.forEach(({key}, i) => {
            if(key === targetKey) lastIndex = i-1
        })
        const newChatBoxes = chatBoxes.filter(
            (chatBox) => chatBox.key !== targetKey);
        if(newChatBoxes.length){
            if(newActiveKey === targetKey){
                if(lastIndex > 0){
                    newActiveKey = newChatBoxes[lastIndex].key;
                } else {newActiveKey = newChatBoxes[0].key}
            }
        } else newActiveKey = '';
        setChatBoxes(newChatBoxes);
        return newActiveKey
    }
    client.onmessage = (byteString) => {
        const {type, data} = JSON.parse(byteString.data); 
        switch (type){
            case 'CHAT': {
                const {messages, key, friend} = data 
                console.log(messages, key, friend)
                const newChatBoxes = [...chatBoxes]
                newChatBoxes.push({friend, key: key, chatLog: messages});
                setChatBoxes(newChatBoxes);
                break;
            }
            case 'MESSAGE': {
                const {message, key} = data 
                const newChatBoxes = [...chatBoxes]
                var index;
                for(var i = 0; i < newChatBoxes.length; i++)
                    if(newChatBoxes[i].key === key)
                        index = i
                newChatBoxes[index].chatLog = [...newChatBoxes[index].chatLog, message]
                setChatBoxes(newChatBoxes)
                break;
            }
            default: break;
        }
    }
    const sendMessage = (type, payload) => {
        console.log(payload)
        sendData({type: type, data: payload});
    }
    const sendData = async (data) => {
        await client.send(JSON.stringify(data))
    }
    return {chatBoxes, createChatBox, removeChatBox, sendMessage}
};

export default useChatBox;
