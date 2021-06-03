import { useState } from 'react';

const useChatBox = ({ me, activeKey }) => {
    const [chatBoxes, setChatBoxes] = useState([]);

    const createKey = (name) => {
        return (me <= name)
            ? `${me}_${name}`
            : `${name}_${me}`;
    };

    const validChatBox = (friend) => {
        const newKey = createKey(friend);
        if (chatBoxes.some(({key}) => key === newKey)) {
            return false;
            // throw new Error(`${friend}'s ChatRoom has already been opened`);
        }
        return true;
    }

    const createChatBox = (friend, messages) => {
        const newKey = createKey(friend);
        // if (chatBoxes.some(({key}) => key === newKey)) {
        //     // return;
        //     throw new Error(`${friend}'s ChatRoom has already been opened`);
        // }
        const newChatBoxes = [...chatBoxes];
        const chatLog = messages;
        if (!validChatBox(friend)) {
            // chatBox exist
            let index;
            newChatBoxes.forEach(({ key }, i) => {
                if (key === newKey) index = i;
            });
            newChatBoxes[index].chatLog = chatLog;
        } else {
            // not exist, add
            newChatBoxes.push({ friend, key: newKey, chatLog });
        }
        console.log(newChatBoxes);
        setChatBoxes(newChatBoxes);
        return newChatBoxes;
    };

    const removeChatBox = (targetKey) => {
        let newActiveKey = activeKey;
        let lastIndex = -1;
        chatBoxes.forEach(({ key }, i) => {
            if (key === activeKey) lastIndex = i - 1;
        });
        const newChatBoxes = chatBoxes.filter((chatBox) => chatBox.key !== targetKey);
        if (newChatBoxes.length) {
            if (newActiveKey === targetKey) {
                // close the current window
                // change activeKey
                if (lastIndex >= 0) {
                    newActiveKey = newChatBoxes[lastIndex].key;
                } else {
                    newActiveKey = newChatBoxes[0].key;
                }
            }
        } else {
            newActiveKey = '';
        }
        setChatBoxes(newChatBoxes);
        return newActiveKey;
    };

    const appendMessage = (message, name=undefined, target=undefined) => {
        console.log(target);
        const newChatBoxes = [...chatBoxes];
        let targetKey;
        if (name !== undefined) {
            // recover chat history
            targetKey = createKey(name);
        } else if (target !== undefined) {
            targetKey = target;
        } else {
            targetKey = activeKey;
        }
        let index = -1;
        chatBoxes.forEach(({ key }, i) => {
            if (key === targetKey) index = i;
        });
        console.log(activeKey);
        console.log(targetKey);
        console.log(message);
        if (name !== undefined) {
            newChatBoxes[index].chatLog.push(...message);
        } else {
            newChatBoxes[index].chatLog.push(message);
        }
        setChatBoxes(newChatBoxes);
    }

    return { chatBoxes, createChatBox, removeChatBox, appendMessage, validChatBox };
};

export default useChatBox;
