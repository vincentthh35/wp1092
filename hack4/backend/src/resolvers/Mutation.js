const severityList = [0, 1, 2];
const Mutation = {
    insertPeople(parent, { data }, { db, pubsub }, info) {
        if (!db || !db.people) {
            console.error('DB error');
            return false;
        }
        if (!data) {
            console.log(data);
            console.error('data is required at insertPeople!');
            return false;
        }
        try {
            // console.log(data);
            const collections = db.people;
            data.forEach((newPerson) => {
                if (!newPerson.ssn) {
                    return false;
                }
                const existIndex = collections.findIndex((p) => {
                    return p.ssn === newPerson.ssn;
                })
                // console.log(existIndex);
                if (existIndex === -1) {
                    // add a new person
                    if (!newPerson.name ||
                        !severityList.indexOf(newPerson.severity) === -1 ||
                        !newPerson.location ||
                        !newPerson.location.name ||
                        !newPerson.location.description)
                    {
                        console.log('Please fill in all fields of Person!');
                        return false;
                    }
                    collections.push(newPerson);
                } else {
                    // update
                    collections[existIndex] = {
                        ...collections[existIndex],
                        ...newPerson,
                    };
                }
            });

            pubsub.publish('people', {
                people: collections,
            });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    },
};

export default Mutation;
