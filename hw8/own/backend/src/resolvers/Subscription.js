const Subscription = {
    user: {
        async subscribe(parent, { name }, { db, pubsub }, info) {
            const user = await db.UserModel.findOne({ name });
            if (!user) {
                console.log('subscribe to a new user');
            }

            return pubsub.asyncIterator(`user ${name}`);
        }
    },
};

export default Subscription;
