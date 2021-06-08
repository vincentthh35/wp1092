import '../App.css';
import { useState, useEffect, useRef } from 'react';
import { Tabs, Input } from 'antd';
import ChatModal from '../Components/ChatModal';
import useChatBox from '../hooks/useChatBox';
import useChat from '../hooks/useChat';
import MessageLayout from '../Components/MessageLayout';

const CHAT_HIS_KEY = 'save-chat-hist';

const { TabPane } = Tabs;
const ChatRoom = ({ me, displayStatus }) => {
    const [messageInput, setMessageInput] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [activeKey, setActiveKey] = useState('');
    const [messageTo, setMessageTo] = useState('');
    const [receivedMessage, setReceivedMessage] = useState({});
    const scrollRef = useRef(null);
    const { chatBoxes, createChatBox, removeChatBox, appendMessage, validChatBox } = useChatBox({ me, activeKey });
    const { sendMessage } = useChat({ me, displayStatus, createChatBox, setReceivedMessage });

    const addChatBox = () => {
        setModalVisible(true);
    };

    const handleReceive = (message) => {
        appendMessage(message, undefined, activeKey);
    };

    useEffect(() => {
        if (!receivedMessage.type) {
            return;
        }
        switch (receivedMessage.type) {
            case 'INIT':
                // recover history
                receivedMessage.chatBoxes.forEach((key) => updateActiveKey(key));
                break;
            case 'CHAT':
                const newChatBoxes = createChatBox(receivedMessage.name, receivedMessage.messages);
                localStorage.setItem(CHAT_HIS_KEY, JSON.stringify(newChatBoxes.map(({ key }) => key)));
                break;
            case 'MESSAGE':
                handleReceive(receivedMessage.message);
                break;
        }
    }, [receivedMessage]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView();
            // {
            //     behavior: "smooth",
            //     block: "nearest",
            //     inline: "start",
            // }
        }
    });

    const extractTo = (key) => {
        if (key === '') {
            return '';
        }
        let s = key.split('_');
        if (s[0] === me) {
            return s[1];
        } else {
            return s[0];
        }
    };

    const updateActiveKey = async (newActiveKey) => {
        const newTo = extractTo(newActiveKey);
        setActiveKey(newActiveKey);
        setMessageTo(newTo);
        if (newTo !== '') {
            const ret = await sendMessage({
                type: 'CHAT',
                data: {
                    name: me,
                    to: newTo
                }
            });
            if (ret !== 0)
                displayStatus({
                    type: 'error',
                    msg: 'Error connecting to server! Please refresh this page or restart the server!'
                });
        }
    };

    const handleSend = (message) => {
        appendMessage(message);
    };

    const renderChatLog = (chatLog) => {
        return chatLog.map(({ name, body }, i) => {
            return (<MessageLayout
                name={name}
                body={body}
                sentByMe={name === me}
                key={`M_${name}_${i}`}
                i={i}
             />)
        });
    }

    const handleCloseTab = async (targetKey) => {
        const ret = await sendMessage({
            type: 'CLOSE',
            data: {
                name: me,
                key: targetKey,
            },
        });
        updateActiveKey(removeChatBox(targetKey));
    };

    return (
        <>
            <div className='App-title'><h1>{me}'s ChatRoom</h1></div>
            <div className='App-messages'>
                <Tabs
                    type='editable-card'
                    onEdit={(targetKey, action) => {
                        if (action === 'add') addChatBox();
                        else if (action === 'remove') handleCloseTab(targetKey);
                    }}
                    activeKey={activeKey}
                    onChange={(key) => { updateActiveKey(key); }}
                >
                    {chatBoxes.map(
                        ({ friend, key, chatLog }) => {
                            return (
                                <TabPane tab={friend} key={key} closable={true}>
                                    <div className='overflow'>
                                        {renderChatLog(chatLog)}
                                        <div ref={scrollRef}/>
                                    </div>
                                </TabPane>
                            );
                        }
                    )}
                </Tabs>
                <ChatModal
                    visible={modalVisible}
                    onCreate={async ({name}) => {
                        if (!validChatBox(name)) {
                            displayStatus({
                                type: 'error',
                                msg: `${name}'s ChatRoom has already been opened`
                            });
                        }
                        setModalVisible(false);
                        const newKey = (me <= name)
                            ? `${me}_${name}`
                            : `${name}_${me}`;
                        updateActiveKey(newKey);
                    }}
                    onCancel={() => {
                        setModalVisible(false);
                    }}
                    displayStatus={displayStatus}
                />
            </div>
            <Input.TextArea
                autoFocus
                value={messageInput}
                onChange={(e) => {
                    let l = e.target.value.length;
                    if (e.target.value[l-1] !== '\n') {
                        setMessageInput(e.target.value);
                    } else {
                        setMessageInput(e.target.value.slice(0, -1))
                    }
                }}
                // enterButton='Send'
                placeholder='Enter message here'
                autoSize
                allowClear
                onPressEnter={async (e) => {
                    let msg = messageInput
                    if (!msg) {
                        displayStatus({
                            type: 'error',
                            msg: 'Please enter message.'
                        });
                        return;
                    } else if (activeKey === '') {
                        displayStatus({
                            type: 'error',
                            msg: 'Please add a chat room first.'
                        });
                        return;
                    }
                    const ret = await sendMessage({
                        type: 'MESSAGE',
                        data: {
                            name: me,
                            to: messageTo,
                            body: msg
                        }
                    });
                    if (ret === 0) displayStatus({ type: 'success', msg: 'Message successfully sent'});
                    else displayStatus({ type: 'error', msg: 'Eror when sending message' });
                    setMessageInput('');
                    // handleSend({ name: me, body: msg, activeKey });
                }}
            ></Input.TextArea>
        </>
    );
}

export default ChatRoom;
