import "../App.css";
import { useEffect, useRef, useState } from "react";
import { Tabs, Input } from "antd";
import ChatModal from "../Components/ChatModal";
import useChatBox from "../hooks/useChatBox";
import useChat from "../hooks/useChat";

const { TabPane } = Tabs;
const ChatRoom = ({ me, displayStatus }) => {
    const [messageInput, setMessageInput] = useState("");
    const [activeKey, setActiveKey] = useState("");
    const {chatBoxes, createChatBox, removeChatBox, setChatBoxes} = useChatBox();
    const {sendMessage} = useChat();
    const [modalVisible, setModalVisible] = useState(false);
    const [opened, setOpened] = useState([]);
    const socket = useRef(null);

    const addChatBox = () => {setModalVisible(true);};

    useEffect(() => {
        var open = localStorage.getItem(`${me}LastOpen`);
        open = JSON.parse(open);
        socket.current = new WebSocket('ws://localhost:4000');
        socket.current.onopen = () => {
            console.log('socket connected');
            setOpened(open);
        };
        socket.current.onclose = () => console.log('socket closed');
        
        socket.current.sendEvent = (e) => socket.current.send(JSON.stringify(e));
        return () => {
            socket.current.close();
        }
    }, [])

    useEffect(() => {
        socket.current.onmessage = (m) => {
            const message = JSON.parse(m.data);
            const {type} = message;
            // console.log(message);
            switch(type) {
                case 'CHAT': {
                    const {messages, key, friend} = message.data;
                    let newChatBoxes = [...chatBoxes];
                    let target = newChatBoxes.find(chatbox => chatbox.key === key);
                    if(target === undefined) {
                        socket.current.sendEvent({
                            type: 'CHAT',
                            data: {to: friend, name: me}
                        })
                        break;
                    }
                    target.chatLog = messages;
                    setChatBoxes(newChatBoxes);
                    break;
                }
                case 'MESSAGE': {
                    const {key} = message.data;
                    const msg = message.data.message;
                    let newChatBoxes = [...chatBoxes];
                    let target = newChatBoxes.find(chatbox => chatbox.key === key);
                    if(target === undefined) {
                        break;
                    }
                    target.chatLog.push(msg);
                    setChatBoxes(newChatBoxes);
                    break;
                }
            }
        }
        let open = [];
        chatBoxes.forEach(chatbox => {
            open.push(chatbox.friend);
        })
        localStorage.setItem(`${me}LastOpen`, JSON.stringify(open));
    }, [chatBoxes]);

    useEffect(() => {
        if(opened === null || opened.length === 0) {
            return;
        }
        let friend = opened[0];
        setActiveKey(createChatBox(friend, me));
        socket.current.sendEvent({
            type: 'CHAT',
            data: {to: friend, name: me}
        });
        let newOpened = [...opened];
        newOpened.splice(0, 1);
        setOpened(newOpened);
    }, [opened])

    return (
        <> 
            <div className="App-title">
                <h1>{me}'s Chat Room</h1> </div>
            <div className="App-messages">
                <Tabs 
                    type="editable-card"
                    activeKey={activeKey}
                    onChange={(key) => {
                        setActiveKey(key);
                    }}
                    onEdit={(targetKey, action) => {
                        if(action === 'add') {
                            addChatBox();
                        }
                        else if(action === 'remove') {
                            setActiveKey(removeChatBox(targetKey, activeKey));
                        }
                    }} >
                    {chatBoxes.map((
                        { friend, key, chatLog }) => {
                            return (
                                <TabPane tab={friend} 
                                key={key} closable={true}>
                                {chatLog.map((item, index) => {
                                    return (
                                        <div key={index} className={item.name === me ? "my_msg" : "friend_msg"}>
                                            {item.name === me ?
                                            <>
                                                <p className="msg">{item.body}</p>
                                                <p className="sender">{item.name}</p>
                                            </>
                                            :
                                            <>
                                                <p className="sender">{item.name}</p>
                                                <p className="msg">{item.body}</p>
                                            </>
                                            }
                                        </div>
                                    )
                                })}
                                </TabPane>
                            );})}
                </Tabs>
                <ChatModal 
                    visible={modalVisible}
                    onCreate={({name}) => {
                        if(chatBoxes.find(chatbox => chatbox.friend === name) !== undefined) {
                            displayStatus({
                                type: 'error',
                                msg: `${name}'s chat box has already opened.`
                            });
                            return;
                        }
                        setActiveKey(createChatBox(name, me));
                        setModalVisible(false);
                        socket.current.sendEvent({
                            type: 'CHAT',
                            data: {to: name, name: me}
                        })
                        // createSocket(name, me);
                    }}
                    onCancel={() => {
                        setModalVisible(false);
                    }} 
                    displayStatus={displayStatus}
                />
            </div>
            <Input.Search
            value={messageInput}
            onChange={(e) => 
                setMessageInput(e.target.value)}
            enterButton="Send"
            placeholder="Enter message here..."
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
                sendMessage({ name: me, to: chatBoxes.find(chatbox => chatbox.key === activeKey).friend, body: msg }, socket);
                setMessageInput("");
                }
            }
            ></Input.Search> 
        </>
    );
};

export default ChatRoom;