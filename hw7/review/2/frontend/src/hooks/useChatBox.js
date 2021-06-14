import {useState} from 'react';

const useChatBox = () => {
    const [chatBoxes, setChatBoxes] = useState([]);
    const createChatBox = (friend, me) => {
        const newKey = me <= friend ? `${me}_${friend}` : `${friend}_${me}`;
        if(chatBoxes.some(({key}) => key === newKey)) {
            throw new Error(friend + "'s chat box has already opened.");
        }
        const newChatBoxes = [...chatBoxes];
        const chatLog = [];
        newChatBoxes.push({friend, key: newKey, chatLog});
        // console.log(newChatBoxes);
        setChatBoxes(newChatBoxes);
        // setActiveKey(newKey);
        return newKey;
    }

    const removeChatBox = (targetKey, activeKey) => {
        let newActiveKey = activeKey;
        let lastIndex;
        chatBoxes.forEach(({ key }, i) => {
            if (key === targetKey) { lastIndex = i - 1; }
        });
        const newChatBoxes = chatBoxes.filter((chatBox) => chatBox.key !== targetKey);
        if (newChatBoxes.length) {
            if (newActiveKey === targetKey) {
                if (lastIndex >= 0) {
                    newActiveKey = newChatBoxes[lastIndex].key;
                } 
                else { 
                    newActiveKey = newChatBoxes[0].key; 
                }
            }
        } 
        else newActiveKey = ""; // No chatBox left
        setChatBoxes(newChatBoxes);
        // setActiveKey(newActiveKey);
        return newActiveKey;
    };

    const addMessage = (key, message, chatBoxesRef) => {
        const newChatBoxes = [...chatBoxesRef.current];
        console.log('addMessage', newChatBoxes.length, message);
        newChatBoxes.find(chatbox => chatbox.key === key).chatLog.push(message);
        console.log(newChatBoxes.find(chatbox => chatbox.key === key));
        setChatBoxes(newChatBoxes);
    }
    return {chatBoxes, createChatBox, removeChatBox, setChatBoxes};
};

export default useChatBox;