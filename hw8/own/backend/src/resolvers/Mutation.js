const makeName = (name, to) => {
  return [name, to].sort().join('_');
};

const checkUser = async (name, db) => {
    const existing = await db.UserModel.findOne({ name });
    if (existing) {
        return existing;
    } else {
        return false;
    }
};

const checkAndAddUser = async (name, db) => {
    const existing = await db.UserModel.findOne({ name });
    if (existing) {
        return existing;
    }
    return new db.UserModel({ name }).save();
};

const checkChatBox = async (name, db) => {
    const existing = await db.ChatBoxModel.findOne({ name });
    if (existing) {
        return existing;
    } else {
        return false;
    }
};

const checkAndAddChatBox = async (name, db) => {
    const existing = await db.ChatBoxModel.findOne({ name });
    if (existing) {
        return existing;
    }
    return new db.ChatBoxModel({ name, aUnreadB: 0, bUnreadA: 0 }).save();
}

const Mutation = {
    async createChatBox(parent, { name1, name2 },
                                { db, pubsub }, info)
    {
        if (!name1 || !name2) {
            throw new Error('Empty field in createChatBox');
        }

        const user1 = await checkAndAddUser(name1, db);
        const user2 = await checkAndAddUser(name2, db);

        const name = makeName(name1, name2);
        let box = await db.ChatBoxModel.findOne({ name });
        if (!box) {
            box = await new db.ChatBoxModel({ name, aUnreadB: 0, bUnreadA: 0 }).save();
        }
        return box;
    },
    async appendChatBoxToUser(parent, { chatBoxName, name },
                                      { db, pubsub }, info)
    {
        if (!chatBoxName || !name) {
            throw new Error('Empty field in appendChatBoxToUser');
        }

        const user = await checkAndAddUser(name, db);
        const name2 = chatBoxName.split('_')[0] === name
            ? chatBoxName.split('_')[1]
            : chatBoxName.split('_')[0];
        const user2 = await checkAndAddUser(name2, db);

        const chatBox = await checkAndAddChatBox(chatBoxName, db);

        pubsub.publish(`user ${user.name}`, {
            user: {
                mutation: 'ADD_CHATBOX',
                chatBox,
            }
        });

        let exist = false;
        user.chatBoxes.forEach((c) => {
            if (c.equals(chatBox._id)) exist = true;
        });

        if (!exist) {
            user.chatBoxes.push(chatBox);
            await user.save();
        }
        return chatBox;
    },
    async removeChatBoxFromUser(parent, { chatBoxName, name },
                                        { db, pubsub }, info)
    {
        if (!chatBoxName || !name) {
            throw new Error('Empty field in removeChatBoxFromUser');
        }

        const user = await checkUser(name, db);
        if (!user) {
            throw new Error(`User not found: ${name}`);
        }

        const chatBox = await checkChatBox(chatBoxName, db);
        if (!chatBox) {
            throw new Error(`ChatBox not found: ${chatBoxName}`);
        }

        pubsub.publish(`user ${user.name}`, {
            user: {
                mutation: 'REMOVE_CHATBOX',
                chatBoxName: chatBox.name,
            }
        });

        const newChatBoxes = user.chatBoxes.filter(
            (c) => !c.equals(chatBox._id)
        );
        user.chatBoxes = newChatBoxes;
        await user.save();
        return chatBox;
    },
    async createUser(parent, { name }, { db, pubsub }, info) {
        if (!name) {
            throw new Error('Empty field in createUser');
        }
        const user = await checkAndAddUser(name, db);
        return user;
    },
    async appendMessage(parent, { name, to, body  },
                                { db, pubsub }, info)
    {
        if (!name || !to || !body) {
            throw new Error('Empty field in appendMessage');
        }
        const chatBoxName = makeName(name, to);

        const sender = await checkAndAddUser(name, db);
        const receiver = await checkAndAddUser(to, db);
        const chatBox = await checkAndAddChatBox(chatBoxName, db);

        const newMessage = new db.MessageModel({ sender, body });
        await newMessage.save();

        chatBox.messages.push(newMessage);
        if (chatBoxName.split('_')[0] === to) {
            chatBox.aUnreadB += 1;
            chatBox.bUnreadA = 0;
        } else if (chatBoxName.split('_')[1] === to) {
            chatBox.bUnreadA += 1;
            chatBox.aUnreadB = 0;
        }
        if (chatBoxName.split('_')[0] === chatBoxName.split('_')[1]) {
            chatBox.bUnreadA = 0;
            chatBox.aUnreadB = 0;
        }

        pubsub.publish(`user ${sender.name}`, {
            user: {
                mutation: 'MESSAGE',
                chatBoxName,
                message: newMessage,
                aUnreadB: chatBox.aUnreadB,
                bUnreadA: chatBox.bUnreadA,
            }
        });

        if (sender.name !== receiver.name) {
            pubsub.publish(`user ${receiver.name}`, {
                user: {
                    mutation: 'MESSAGE',
                    chatBoxName,
                    message: newMessage,
                    aUnreadB: chatBox.aUnreadB,
                    bUnreadA: chatBox.bUnreadA,
                }
            });
        }

        await chatBox.save();

        return chatBox;
    },
    async readChatBox(parent, { name, chatBoxName },
                              { db, pubsub}, info)
    {
        if (!name || !chatBoxName) {
            throw new Error('Blank field in readChatBox!');
        }
        const user = checkUser(name, db);
        if (!user) {
            throw new Error(`User ${name} not found!`);
        }
        const chatBox = await checkChatBox(chatBoxName, db);
        if (!chatBox) {
            throw new Error(`ChatBox ${chatBoxName} not found!`);
        }

        if (chatBoxName.split('_')[0] === name) {
            chatBox.aUnreadB = 0;
        } else if (chatBoxName.split('_')[1] === name) {
            chatBox.bUnreadA = 0;
        } else {
            throw new Error(`User ${name} is not in ChatBox ${chatBoxName}!`);
        }
        if (chatBoxName.split('_')[0] === chatBoxName.split('_')[1]) {
            chatBox.bUnreadA = 0;
            chatBox.aUnreadB = 0;
        }

        pubsub.publish(`user ${name}`, {
            user: {
                mutation: 'READ',
                chatBoxName,
                aUnreadB: chatBox.aUnreadB,
                bUnreadA: chatBox.bUnreadA,
            }
        });

        await chatBox.save();

        return "Successfully readChatBox";
    }
};

export default Mutation;
