import '../App.css';
import { useState, useEffect } from 'react';
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
    const { chatBoxes, createChatBox, removeChatBox, appendMessage, validChatBox } = useChatBox({ me, activeKey });
    const recoverHistory = () => {
        const his = JSON.parse(localStorage.getItem(CHAT_HIS_KEY));
        console.log(his);
        if (his) {
            // recover history
            console.log('AA');
            his.forEach((key) => {
                updateActiveKey(key);
            });
        }
    }
    const { sendMessage, createSocket } = useChat({ me, displayStatus, createChatBox, setReceivedMessage, recoverHistory });

    const addChatBox = () => {
        setModalVisible(true);
    };

    const handleReceive = (message) => {
        console.log(`receive: ${message}`);
        console.log(activeKey);
        appendMessage(message, undefined, activeKey);
    };


    useEffect(() => {
        if (!receivedMessage.type) {
            return;
        }
        switch (receivedMessage.type) {
            case 'CHAT':
                const newChatBoxes = createChatBox(receivedMessage.name, receivedMessage.messages);
                console.log(newChatBoxes);
                localStorage.setItem(CHAT_HIS_KEY, JSON.stringify(newChatBoxes.map(({ key }) => key)));
                break;
            case 'MESSAGE':
                handleReceive(receivedMessage.message);
                break;
        }
    }, [receivedMessage]);

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
        console.error(`updateActiveKey(${newActiveKey})`);
        const newTo = extractTo(newActiveKey);
        setActiveKey(newActiveKey);
        setMessageTo(newTo);
        const ret = await sendMessage({
            type: 'CHAT',
            data: {
                name: me,
                to: newTo
            }
        });
        if (ret !== 0) displayStatus({ type: 'error', msg: 'Error connecting to server! Please refresh this page or restart the server!' })
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

    const handleCloseTab = (targetKey) => {
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
                                    <div className='overflow'>{renderChatLog(chatLog)}</div>
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
                        console.log(newKey);
                        updateActiveKey(newKey);
                        // await sendMessage({
                        //     type: 'CHAT',
                        //     data: {
                        //         name: me,
                        //         to: name
                        //     }
                        // });
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
                    console.log(e);
                    let msg = messageInput
                    console.log(messageInput);
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
                    console.log(ret);
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
