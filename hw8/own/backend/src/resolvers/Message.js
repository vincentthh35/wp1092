const Message = {
    async chatBox(parent, args, { db }, info) {
        return await db.ChatBoxModel.findById(parent.chatBox);
    },
    async sender(parent, args, { db }, info) {
        return await db.UserModel.findById(parent.sender);
    },
};

export default Message;
