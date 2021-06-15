const Subscription = {
    people: {
        subscribe(parent, args, { db, pubsub }, info) {
            return pubsub.asyncIterator('people');
        },
    },
};

export default Subscription;
