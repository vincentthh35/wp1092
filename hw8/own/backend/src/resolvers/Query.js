const Query = {
    async messages(parent, { chatBoxId, chatBoxName }, { db }, info) {
        if (!chatBoxId && !chatBoxName) {
            throw new Error('Please fill in required field!');
        }
        let chatBox;
        if (chatBoxId) {
            chatBox = await db.ChatBoxModel.findById(chatBoxId);
        }
        if (chatBoxName) {
            chatBox = await db.ChatBoxModel.findOne({ name: chatBoxName });
        }
        return Promise.all(
            chatBox.messages.map((mId) =>
                db.MessageModel.findById(mId)),
        );
    },
    async user(parent, { name }, { db }, info) {
        if (!name) {
            throw new Error('Please fill in required field: name');
        }
        const user = await db.UserModel.findOne({ name });
        if (!user) {
            return await new db.UserModel({ name }).save()
        }
        return user;
    }
};

export default Query;
