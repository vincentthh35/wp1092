import "../App.css";
import React, { useState } from "react";
import { Tabs, Input, Typography } from "antd";
import ChatModal from "./ChatModal";
import useChatBox from "../hook/useChatBox";
import useChat from "../hook/useChat";
import useServer from "../server";
const { Paragraph } = Typography;
const { TabPane } = Tabs;
const ChatRoom = ({ me }) => {
  const [messageInput, setMessageInput] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [activeKey, setActiveKey] = useState("");

  const addChatBox = () => {
    setModalVisible(true);
  };
  const { chatBoxes, createChatBox, removeChatBox } = useChatBox(
    me,
    activeKey,
    setActiveKey
  );
  const { messages, startChat, SendMessage } = useServer();
  const { status, setStatus, sendMessage } = useChat(me, SendMessage);

  return (
    <div style={{ width: "60%", margin: "0 auto" }}>
      {" "}
      <div className="App-title">
        <h1>{me}'s Chat Room</h1>{" "}
      </div>
      <div className="App-messages">
        <Tabs
          type="editable-card"
          activeKey={activeKey}
          onChange={(key) => {
            let users = key.split("_");
            startChat(me, me === users[1] ? users[0] : users[1]);
            setActiveKey(key);
          }}
          onEdit={(targetKey, action) => {
            if (action === "add") {
              addChatBox();
            } else if (action === "remove") removeChatBox(targetKey);
          }}
        >
          {chatBoxes.map(({ friend, key, chatLog }) => {
            return (
              <TabPane tab={friend} key={key} closable={true}>
                <p>{friend}'s chatbox.</p>
                {messages.map((msg, index) => (
                  <Paragraph
                    key={index}
                    className={"chat " + (me === msg.name ? "right" : "left")}
                  >
                    {(me === msg.name ? "" : `${msg.name}: `) + msg.body}
                  </Paragraph>
                ))}
              </TabPane>
            );
          })}
        </Tabs>
      </div>
      <Input.Search
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        enterButton="Send"
        placeholder="Enter message here..."
        onSearch={(msg) => {
          if (!msg) {
            setStatus({
              type: "Error",
              msg: "Please enter message.",
            });
            return;
          } else if (activeKey === "") {
            setStatus({
              type: "Error",
              msg: "Please add a chatbox first.",
            });
            setMessageInput("");
            return;
          }
          sendMessage({ key: activeKey, body: msg });
          setMessageInput("");
        }}
      ></Input.Search>
      {status.type ? (
        <h4 style={{ color: "red" }}>{`[${status.type}] ${status.msg}`}</h4>
      ) : (
        <></>
      )}
      <ChatModal
        visible={modalVisible}
        onCreate={({ name }) => {
          createChatBox(name);
          startChat(me, name);
          setModalVisible(false);
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
      />
    </div>
  );
};
export default ChatRoom;
