import "../App.css";
import { useState, useEffect } from "react";
import { Tabs, Input, Avatar, Tag } from "antd";
import ChatModal from '../Components/ChatModal'
import useChatBox from '../Hooks/useChatBox'
import useChat from '../Hooks/useChat'

const { TabPane } = Tabs;
const ChatRoom = ({ me, displayStatus }) => {
  const [messageInput, setMessageInput] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const addChatBox = () => { setModalVisible(true); };
  const [activeKey, setActiveKey] = useState("")
  const [activeName, setActiveName] = useState('')
  const {CreateChatBox, RemoveChatBox} = useChatBox();
  const {sendMessage, startChat, messages} = useChat()
  const [chatBoxes, setChatBoxes] = useState([])

  useEffect(() => {
    if (activeName !== ''){
      let loadingChatBox = chatBoxes.filter(chatBox => chatBox.friend === activeName)[0]
      loadingChatBox.chatLog = messages
      let newChatBoxes = chatBoxes.filter(chatBox => chatBox.friend !== activeName)
      newChatBoxes.push(loadingChatBox)
      setChatBoxes(newChatBoxes)
    }
  }, [messages])
  return (
    <> <div className="App-title">
         <h1>{me}'s Chat Room</h1> </div>
        <div className="App-messages">
            <Tabs type="editable-card"
                activeKey={activeKey}
                onChange={(key) => { setActiveKey(key); }}
                onEdit={(targetKey, action) => {
                    if (action === "add") addChatBox();
                    else if (action === "remove") setActiveKey(RemoveChatBox(targetKey, activeKey, chatBoxes, setChatBoxes));
                }}
            >
            {chatBoxes.map((
                { friend, key, chatLog }) => {
                  return (
                      <TabPane tab={friend} 
                      key={key} closable={true}>
                      {chatLog.map((message, index) => {
                        let body = message.body
                        // if (message.body.length > 50){
                        //   let pieces = message.body.match(/(.{1,50})/g);
                        //   for (let i=0;i<pieces.length; i++){
                        //     body = body + pieces[i] + '\n'
                        //   }
                        // } 
                        return message.name===me?
                        <p key={index} align='right'><Tag color="blue" style={{whiteSpace: 'pre-wrap'}}>{body}</Tag> <Avatar style={{backgroundColor: '#e76f51', verticalAlign: 'middle'}}>{message.name}</Avatar></p>:
                        <p key={index} align='left'><Avatar style={{backgroundColor: '#4895ef', verticalAlign: 'middle'}}>{message.name}</Avatar> <Tag style={{whiteSpace: 'pre-wrap'}}>{body}</Tag></p>
                      })}
                      </TabPane>
                  );})}
            </Tabs>
            <ChatModal
                visible={modalVisible}
                onCreate={({ name }) => {
                  setActiveName(name)
                  startChat(me, name)
                  setActiveKey(CreateChatBox(name, me, chatBoxes, setChatBoxes));
                  setModalVisible(false);
                }}
                onCancel={() => {
                    setModalVisible(false);
                }}
            />

        </div>
            <Input.Search
              value={messageInput}
              onChange={(e) => 
                setMessageInput(e.target.value)}
              enterButton="Send"
              placeholder=
                "Enter message here..."
              onSearch={(msg) => { 
                if (!msg) {
                    displayStatus({
                      type: "error",
                      msg: "Please enter message.",
                    });
                    return;
                } else if (activeKey === "") {
                    displayStatus({
                      type: "error",
                      msg: "Please add a chatbox first.",
                    });
                    setMessageInput("");
                    return;
                }
                sendMessage({ name: me, key: activeKey, body: msg });            
                setMessageInput(""); }}
            ></Input.Search>
            {/* <button onClick={()=>console.log(messages)}>Click</button> */}
        </>);
      };
      export default ChatRoom;
      