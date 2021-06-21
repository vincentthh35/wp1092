import "../App.css";
import { useState } from "react";
import { Tabs, Input } from "antd";
import ChatModal from "../Container/ChatModal";
import useChatBox from "../hooks/useChatBox";
import useChat from "../hooks/useChat";
const { TabPane } = Tabs;
const server = new WebSocket('ws://localhost:4000');
server.onopen = () => console.log('Server connected.');
server.sendEvent = (e) => server.send(JSON.stringify(e));
const ChatRoom = ({ me, displayStatus}) => {
  const [messageInput, setMessageInput] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [activeKey, setActiveKey] = useState("");
  const { chatBoxes, createChatBox, removeChatBox, onEvent} = useChatBox();
  const { sendMessage} = useChat();
  const addChatBox = () => { setModalVisible(true); };
  

  server.onmessage = (m) => {
    console.log(JSON.parse(m.data))
    onEvent(JSON.parse(m.data), me)
  };

  return (
    <> <div className="App-title"><h1>{me}'s Chat Room</h1></div>
      <div className="App-messages">
        <Tabs
          type="editable-card"
          onEdit={(targetKey, action) => {
            if (action === "add") addChatBox();
            else if (action === "remove") setActiveKey(removeChatBox(targetKey, activeKey));
          }}
          activeKey={activeKey}
          onChange={(key) => { setActiveKey(key); }}
        >
          {chatBoxes.map((
            { friend, key, chatLog }) => {
              return (
                <TabPane tab={friend}
                  key={key} closable={true}>
                    {chatLog.map(({ body, name }) => {
                      if (name === me){
                        return (
                          <div style={{ position: "relative"}}>
                            <br></br>
                            <p style={{ fontSize: 18, overflowWrap: 'break-word', position: "absolute", right: "0px" }}>
                              <span style={{ border: "1px solid #80ffd4" }}>{body}</span>
                              &nbsp;
                              <span style={{ backgroundColor: "#80ffd4" }}>{name}</span></p>
                            <br></br>
                          </div>
                        )
                      }
                      else{
                        return (
                          <div >
                            <p style={{ fontSize: 18, overflowWrap: 'break-word' }}>
                              <span style={{ backgroundColor: "#ffccff" }}>{name}</span>
                              &nbsp;
                              <span style={{ border: "1px solid #ffccff" }}>{body}</span>
                            </p>
                          </div>
                        )
                      }
                    })}
                </TabPane>
            );})}
        </Tabs>
        <ChatModal
          visible={modalVisible}
          onCreate={({ name }) => {
            setActiveKey(createChatBox(name, me, server));
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
          sendMessage(activeKey, msg, me, server, chatBoxes);
          setMessageInput("");
        }}
      ></Input.Search>
  </>);
};
export default ChatRoom;
   