import { useState } from "react";
const useChatBox = () => {
  const [chatBoxes, setChatBoxes] = useState([]);
  const createChatBox = (friend, me, server) => {
    server.sendEvent({
      type: 'CHAT',
      data: { to: friend, name: me },
    });
    const newKey = me <= friend ? `${me}_${friend}` : `${friend}_${me}`;
    if (chatBoxes.some(({ key }) => key === newKey)) {
      throw new Error(friend + "'s chat box has already opened.");
    }
    

    
    return newKey;
  };

  const removeChatBox = (targetKey, activeKey) => {
    let newActiveKey = activeKey;
    let lastIndex;
    chatBoxes.forEach(({ key }, i) => {
      if (key === targetKey) { lastIndex = i - 1; }});
    const newChatBoxes = chatBoxes.filter(
      (chatBox) => chatBox.key !== targetKey);
    if (newChatBoxes.length) {
      if (newActiveKey === targetKey) {
        if (lastIndex >= 0) {
          newActiveKey = newChatBoxes[lastIndex].key;
        } else { newActiveKey = newChatBoxes[0].key; }
      }
    } else newActiveKey = ""; // No chatBox left
    setChatBoxes(newChatBoxes);
    return newActiveKey;
  };
  
  const onEvent = (e, me)=>{
    const key = e.data.key
    const { type } = e;
    const friend = (me === key.split('_')[0])? key.split('_')[1] : key.split('_')[0];
    if (type === 'CHAT') {
      const newChatBoxes = [...chatBoxes];
      newChatBoxes.push({ friend, key: key, chatLog: e.data.messages});
      setChatBoxes(newChatBoxes);
    }
    else if (type === 'MESSAGE') {
      var index = 0;
      const newChatBoxes = [...chatBoxes];
      for (var i = 0; i < chatBoxes.length; i++) {
        if (key === chatBoxes[i].key) {
          index = i;
          break;
        }
      }
      newChatBoxes[index].chatLog.push(e.data.message)
      setChatBoxes(newChatBoxes)
    }
  }

  return { chatBoxes, createChatBox, removeChatBox, onEvent};
};
export default useChatBox;
 