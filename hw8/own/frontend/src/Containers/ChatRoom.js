import '../App.css';
import { useState, useEffect, useRef } from 'react';
import { Tabs, Input, Badge } from 'antd';
import ChatModal from '../Components/ChatModal';
import MessageLayout from '../Components/MessageLayout';
import UnreadLine from '../Components/UnreadLine';

import { useQuery, useMutation } from '@apollo/react-hooks';
import {
    CREATE_CHATBOX_MUTATION,
    APPEND_CHATBOX_MUTATION,
    REMOVE_CHATBOX_MUTATION,
    APPEND_MESSAGE_MUTATION,
    USER_QUERY,
    USER_SUBCRIPTION,
    READ_CHATBOX_MUTATION,
} from '../graphql'

const getKey = (name, to) => {
    return (name <= to)
        ? `${name}_${to}`
        : `${to}_${name}`;
};

const extractTo = (key, me) => {
    const s = key.split('_');
    return (s[0] === me) ? s[1] : s[0];
};

const { TabPane } = Tabs;
const ChatRoom = ({ me, displayStatus }) => {
    const [startChat] = useMutation(CREATE_CHATBOX_MUTATION);
    const [appendMessage] = useMutation(APPEND_MESSAGE_MUTATION);
    const [appendChatBox] = useMutation(APPEND_CHATBOX_MUTATION);
    const [removeChatBoxMutation] = useMutation(REMOVE_CHATBOX_MUTATION);
    const [readChatBox] = useMutation(READ_CHATBOX_MUTATION);
    const {
        loading: userLoading,
        error: userError,
        data: userData,
        subscribeToMore: userSubscription,
    } = useQuery(USER_QUERY, { variables: { name: me } });

    const [messageInput, setMessageInput] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [activeKey, setActiveKey] = useState('');
    const scrollRef = useRef(null);

    const addChatBox = () => {
        setModalVisible(true);
    };

    const validChatBox = (name) => {
        let ret = true;
        const key = getKey(name, me);
        userData.user.chatBoxes.forEach((e) => { if (e.name === key) ret = false; });
        return ret;
    };

    const updateActiveKey = (name) => {
        // if active chatBox has unread > 0, then readChatBox
        if (name !== '') {
            // marked as read after 3 seconds
            const timer = setTimeout(() => {
                readChatBox({
                    variables: {
                        chatBoxName: name,
                        name: me,
                    },
                });
            }, 3000);
        }
        setActiveKey(name);
    };

    const handleStartChat = async (name) => {
        try {
            const payload = await startChat({
                variables: {
                    name1: me,
                    name2: name
                },
            });
            payload.data.createChatBox.friend = name;
            updateActiveKey(payload.data.createChatBox.name)

            // append chat box history
            appendChatBox({
                variables: {
                    chatBoxName: getKey(me, name),
                    name: me,
                },
            });
        } catch (e) {
            displayStatus({ type: 'error', msg: JSON.stringify(e) });
            console.log(JSON.stringify(e));
        }
    };

    const handleSendMessage = async (msg) => {
        try {
            const to = extractTo(activeKey, me);
            await appendMessage({
                variables: {
                    to,
                    name: me,
                    body: msg,
                },
            });
        } catch (e) {
            displayStatus({ type: 'error', msg: JSON.stringify(e) });
            console.log(JSON.stringify(e));
        }
    }

    // for recover history
    useEffect(() => {
        console.log('userLoading!!!!!!');
        if (userLoading === false) {
            const newChatBoxes = [];
            const tempUnread = [];
            userData.user.chatBoxes.forEach((c) => {
                newChatBoxes.push({ ...c, friend: extractTo(c.name, me)});
                tempUnread.push({ name: c.name, unread: 0 });
            });
            if (newChatBoxes.length) {
                updateActiveKey(newChatBoxes[newChatBoxes.length - 1].name);
            }
        }
    }, [userLoading])

    // for subscribe
    useEffect(() => {
        try {
            let unsubscribe;

            unsubscribe = userSubscription({
                document: USER_SUBCRIPTION,
                variables: { name: me },
                updateQuery: (prev, { subscriptionData }) => {
                    if (!subscriptionData) return prev;
                    if (subscriptionData.data.user.mutation === 'ADD_CHATBOX') {
                        const newChatBox = subscriptionData.data.user.chatBox;
                        return {
                            user: {
                                ...prev.user,
                                chatBoxes: [...prev.user.chatBoxes, newChatBox],
                            },
                        };
                    } else if (subscriptionData.data.user.mutation === 'REMOVE_CHATBOX') {
                        const chatBoxName = subscriptionData.data.user.chatBoxName;
                        const newChatBoxes = prev.user.chatBoxes.filter((c) =>
                            c.name !== chatBoxName);
                        return {
                            user: {
                                ...prev.user,
                                chatBoxes: newChatBoxes,
                            },
                        };
                    } else if (subscriptionData.data.user.mutation === 'READ') {
                        const chatBoxName = subscriptionData.data.user.chatBoxName;
                        const aUnreadB = subscriptionData.data.user.aUnreadB;
                        const bUnreadA = subscriptionData.data.user.bUnreadA;
                        const newChatBoxes = prev.user.chatBoxes.map((c) => {
                            if (c.name === chatBoxName) {
                                return {
                                    ...c,
                                    aUnreadB,
                                    bUnreadA
                                };
                            }
                            return c;
                        });
                        return {
                            user: {
                                ...prev.user,
                                chatBoxes: newChatBoxes,
                            },
                        };
                    } else if (subscriptionData.data.user.mutation === 'MESSAGE') {
                        const chatBoxName = subscriptionData.data.user.chatBoxName;
                        const newMessage = subscriptionData.data.user.message;
                        const aUnreadB = subscriptionData.data.user.aUnreadB;
                        const bUnreadA = subscriptionData.data.user.bUnreadA;
                        const newChatBoxes = prev.user.chatBoxes.map((c) => {
                            if (c.name === chatBoxName) {
                                const cc = {
                                    ...c,
                                    messages: [...c.messages, newMessage],
                                    aUnreadB,
                                    bUnreadA,
                                };
                                return cc;
                            } else {
                                return c;
                            }
                        });
                        return {
                            user: {
                                ...prev.user,
                                chatBoxes: newChatBoxes,
                            },
                        };
                    }
                },
            });

            return () => unsubscribe();
        } catch (e) {
            console.error(e);
        }
    }, [userSubscription]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView();
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

    const renderChatLog = (chatLog, unread) => {
        const l = chatLog.length;
        return chatLog.map(({ sender: { name }, body }, i) => {
            const u = (unread > 0 && i === l - unread)
                ? (<UnreadLine key={`U_${name}_${i}`}/>)
                : "";
            const m = (<MessageLayout
                name={name}
                body={body}
                sentByMe={name === me}
                key={`M_${name}_${i}`}
                i={i}
            />)
            const result = [u, m];
            return (result);
        });
    };

    const removeChatBox = (targetKey) => {
        let newActiveKey = activeKey;
        let lastIndex = -1;
        userData.user.chatBoxes.forEach(({ name: key }, i) => {
            if (key === activeKey) lastIndex = i - 1;
        });
        const newChatBoxes = userData.user.chatBoxes.filter((chatBox) => chatBox.name !== targetKey);
        if (newChatBoxes.length) {
            if (newActiveKey === targetKey) {
                // close the current window
                // change activeKey
                if (lastIndex >= 0) {
                    newActiveKey = newChatBoxes[lastIndex].name;
                } else {
                    newActiveKey = newChatBoxes[0].name;
                }
            }
        } else {
            newActiveKey = '';
        }
        return newActiveKey;
    };

    const handleCloseTab = (targetKey) => {
        updateActiveKey(removeChatBox(targetKey));
        removeChatBoxMutation({
            variables: {
                name: me,
                chatBoxName: targetKey,
            },
        });
    };
    if (userLoading) {
        return (
            <>
                <div className='App-title'><h1>loading chat history...</h1></div>
            </>
        );
    } else if (userError) {
        return (
            <>
                <div className='App-title'><h1>Error...</h1></div>
            </>
        );
    }

    const renderBadge = (friend, count) => {
        return [friend, ' ', <Badge count={(!count) ? 0 : count} dot={true} size="small" offset={[0, 4]} key={`${friend}_b`}></Badge>];
    }

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
                    {userData.user.chatBoxes.map(
                        ({ name, messages, aUnreadB, bUnreadA }) => {
                            let unread = (name.split('_')[0] === me)
                                ? aUnreadB
                                : bUnreadA;
                            const lastUnread = unread;
                            const friend = extractTo(name, me);
                            if (name === activeKey && unread > 0) {
                                unread = 0;
                            }
                            return (
                                <TabPane tab={renderBadge(friend, unread)} key={name} closable={true}>
                                    <div className='overflow'>
                                        {renderChatLog(messages, lastUnread)}
                                        <div ref={scrollRef}/>
                                    </div>
                                </TabPane>
                            );
                        }
                    )}
                </Tabs>
                <ChatModal
                    visible={modalVisible}
                    onCreate={ async ({ name }) => {
                        if (!validChatBox(name)) {
                            displayStatus({
                                type: 'error',
                                msg: `${name}'s chat room has already been opened.`
                            });
                        }
                        setModalVisible(false);
                        await handleStartChat(name);
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
                    setMessageInput('');
                    await handleSendMessage(msg);
                }}
            ></Input.TextArea>
        </>
    );
}

export default ChatRoom;
