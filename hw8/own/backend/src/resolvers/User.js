const User = {
    chatBoxes(parent, args, { db }, info) {
        return Promise.all(
            parent.chatBoxes.map((bId) =>
                db.ChatBoxModel.findById(bId)),
        );
    },
};

export default User;
